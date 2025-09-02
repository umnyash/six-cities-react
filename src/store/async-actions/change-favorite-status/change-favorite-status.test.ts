import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { FavoriteStatus, apiPaths } from '../../../services/api';
import { getMockOffer } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { changeFavoriteStatus } from './change-favorite-status';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: changeFavoriteStatus', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', FavoriteStatus.Off))
      .networkError();

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.Off }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.fulfilled" and return offer data when offer is removed from favorites and server response 200', async () => {
    const mockOffer = getMockOffer({ isFavorite: true });
    const mockChangedOffer = { ...mockOffer, isFavorite: false };
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', FavoriteStatus.Off))
      .reply(StatusCodes.OK, mockChangedOffer);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.Off }));
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const changeFavoriteStatusFulfilled = dispatchedActions[1] as ReturnType<typeof changeFavoriteStatus.fulfilled>;

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.fulfilled.type,
    ]);
    expect(changeFavoriteStatusFulfilled.payload).toEqual(mockChangedOffer);
  });

  it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.fulfilled" and return offer data when offer is added to favorites and server response 201', async () => {
    const mockOffer = getMockOffer({ isFavorite: false });
    const mockChangedOffer = { ...mockOffer, isFavorite: true };
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', FavoriteStatus.On))
      .reply(StatusCodes.CREATED, mockChangedOffer);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.On }));
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const changeFavoriteStatusFulfilled = dispatchedActions[1] as ReturnType<typeof changeFavoriteStatus.fulfilled>;

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.fulfilled.type,
    ]);
    expect(changeFavoriteStatusFulfilled.payload).toEqual(mockChangedOffer);
  });

  it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected" when server responds with 400', async () => {
    const wrongFavoriteStatus = 2 as FavoriteStatus;
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', wrongFavoriteStatus))
      .reply(StatusCodes.BAD_REQUEST);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: wrongFavoriteStatus }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.rejected.type,
    ]);
  });

  it('should call "toast.warn" once with error message when server responds with 400', async () => {
    const wrongFavoriteStatus = 2 as FavoriteStatus;
    const errorMessage = 'bad request';
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', wrongFavoriteStatus))
      .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: wrongFavoriteStatus }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(errorMessage);
  });

  it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected" when server responds with 401', async () => {
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', FavoriteStatus.On))
      .reply(StatusCodes.UNAUTHORIZED);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.On }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.rejected.type,
    ]);
  });

  it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected" when server responds with 404', async () => {
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('nonExistentOfferId', FavoriteStatus.On))
      .reply(StatusCodes.NOT_FOUND);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'nonExistentOfferId', status: FavoriteStatus.On }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.rejected.type,
    ]);
  });

  it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.rejected" when server responds with 409', async () => {
    const currentFavoriteStatus = true;
    const targetFavoriteStatus = +currentFavoriteStatus;
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', targetFavoriteStatus))
      .reply(StatusCodes.CONFLICT);

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: targetFavoriteStatus }));
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      changeFavoriteStatus.pending.type,
      changeFavoriteStatus.rejected.type,
    ]);
  });

  it('should call "toast.warn" once with error message when server responds with 409', async () => {
    const currentFavoriteStatus = true;
    const targetFavoriteStatus = +currentFavoriteStatus;
    const errorMessage = 'conflict';
    mockAPIAdapter
      .onPost(apiPaths.favoriteStatus('existingOfferId', targetFavoriteStatus))
      .reply(StatusCodes.CONFLICT, { message: errorMessage });

    await mockStore.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: targetFavoriteStatus }));

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(errorMessage);
  });
});
