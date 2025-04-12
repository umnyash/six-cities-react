import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import { Action } from 'redux';
import thunk from 'redux-thunk';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { APIRoute, FavoriteStatus } from '../const';
import { State } from '../types/state';
import { AuthData, AuthUser } from '../types/user';
import { omit } from '../util';
import { createAPI } from '../services/api';
import * as tokenStorage from '../services/token';
import {
  checkUserAuth, loginUser, logoutUser,
  fetchAllOffers, fetchNearbyOffers, fetchOffer,
  fetchFavorites, changeFavoriteStatus,
  fetchReviews, submitReview,
} from './async-actions';

import { AppThunkDispatch } from '../mocks/types';
import {
  getMockAuthUser,
  getMockOffers, getMockOffer,
  getMockReviews, getMockReview,
  extractActionsTypes
} from '../mocks/util';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async actions', () => {
  const api = createAPI();
  const mockAPIAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({ OFFERS: { allOffers: [] } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(APIRoute.Login).networkError();

    await store.dispatch(checkUserAuth());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  describe('user actions', () => {
    describe('checkUserAuth', () => {
      it('should dispatch "checkUserAuth.pending", "checkUserAuth.fulfilled" and return user data when server responds with 200', async () => {
        const mockAuthUser: AuthUser = getMockAuthUser();
        const mockUser = omit(mockAuthUser, 'token');
        mockAPIAdapter.onGet(APIRoute.Login).reply(StatusCodes.OK, mockAuthUser);

        await store.dispatch(checkUserAuth());
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const checkUserAuthFulfilled = dispatchedActions[1] as ReturnType<typeof checkUserAuth.fulfilled>;

        expect(actionsTypes).toEqual([
          checkUserAuth.pending.type,
          checkUserAuth.fulfilled.type,
        ]);
        expect(checkUserAuthFulfilled.payload).toMatchObject(mockUser);
      });

      it('should dispatch "checkUserAuth.pending" and "checkUserAuth.rejected" when server responds with 401', async () => {
        mockAPIAdapter.onGet(APIRoute.Login).reply(StatusCodes.UNAUTHORIZED);

        await store.dispatch(checkUserAuth());
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          checkUserAuth.pending.type,
          checkUserAuth.rejected.type,
        ]);
      });
    });

    describe('loginUser', () => {
      it('should dispatch "loginUser.pending", "loginUser.fulfilled" and return user data when server responds with 201', async () => {
        const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
        const mockAuthUser: AuthUser = getMockAuthUser();
        const mockUser = omit(mockAuthUser, 'token');
        mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.CREATED, mockAuthUser);

        await store.dispatch(loginUser(mockAuthData));
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const loginUserFulfilled = dispatchedActions[1] as ReturnType<typeof loginUser.fulfilled>;

        expect(actionsTypes).toEqual([
          loginUser.pending.type,
          loginUser.fulfilled.type,
        ]);
        expect(loginUserFulfilled.payload).toEqual(mockUser);
      });

      it('should call "saveToken" once with the received token on login', async () => {
        const mockAuthData: AuthData = { email: 'test@test.com', password: 'abc123' };
        const mockAuthUser: AuthUser = getMockAuthUser();
        mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.CREATED, mockAuthUser);
        const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

        await store.dispatch(loginUser(mockAuthData));

        expect(mockSaveToken).toHaveBeenCalledTimes(1);
        expect(mockSaveToken).toHaveBeenCalledWith(mockAuthUser.token);
      });

      it('should dispatch "loginUser.pending" and "loginUser.rejected" when server responds with 400', async () => {
        const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
        mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST);

        await store.dispatch(loginUser(mockInvalidAuthData));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          loginUser.pending.type,
          loginUser.rejected.type,
        ]);
      });

      it('should call "toast.warn" once with error message when server responds with 400', async () => {
        const mockInvalidAuthData: AuthData = { email: 'test', password: '0000' };
        const errorMessage = 'bad request';
        mockAPIAdapter.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

        await store.dispatch(loginUser(mockInvalidAuthData));

        expect(toast.warn).toHaveBeenCalledTimes(1);
        expect(toast.warn).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('logoutUser', () => {
      it('should dispatch "logoutUser.pending" and "logoutUser.fulfilled" when server responds with 204', async () => {
        mockAPIAdapter.onDelete(APIRoute.Logout).reply(StatusCodes.NO_CONTENT);

        await store.dispatch(logoutUser());
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          logoutUser.pending.type,
          logoutUser.fulfilled.type,
        ]);
      });

      it('should call "dropToken" once on logout', async () => {
        mockAPIAdapter.onDelete(APIRoute.Logout).reply(StatusCodes.NO_CONTENT);
        const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

        await store.dispatch(logoutUser());

        expect(mockDropToken).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('offers actions', () => {
    describe('fetchAllOffers', () => {
      it('should dispatch "fetchAllOffers.pending", "fetchAllOffers.fulfilled" and return offers array when server responds with 200', async () => {
        const mockOffers = getMockOffers(2);
        mockAPIAdapter.onGet(APIRoute.Offers).reply(StatusCodes.OK, mockOffers);

        await store.dispatch(fetchAllOffers());
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(store.getActions());
        const fetchAllOffersFulfilled = dispatchedActions[1] as ReturnType<typeof fetchAllOffers.fulfilled>;

        expect(actionsTypes).toEqual([
          fetchAllOffers.pending.type,
          fetchAllOffers.fulfilled.type,
        ]);
        expect(fetchAllOffersFulfilled.payload).toEqual(mockOffers);
      });
    });

    describe('fetchNearbyOffers', () => {
      it('should dispatch "fetchNearbyOffers.pending", "fetchNearbyOffers.fulfilled" and offers array when server responds with 200', async () => {
        const mockOffers = getMockOffers(2);
        mockAPIAdapter.onGet(`${APIRoute.Offers}/existingOfferId/nearby`).reply(StatusCodes.OK, mockOffers);

        await store.dispatch(fetchNearbyOffers('existingOfferId'));
        const dispatchedAcitons = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedAcitons);
        const fetchNearbyOffersFulfilled = dispatchedAcitons[1] as ReturnType<typeof fetchNearbyOffers.fulfilled>;

        expect(actionsTypes).toEqual([
          fetchNearbyOffers.pending.type,
          fetchNearbyOffers.fulfilled.type,
        ]);
        expect(fetchNearbyOffersFulfilled.payload).toEqual(mockOffers);
      });

      it('should dispatch "fetchNearbyOffers.pending" and "fetchNearbyOffers.rejected" when server responds with 404', async () => {
        mockAPIAdapter.onGet(`${APIRoute.Offers}/nonExistentOfferId/nearby`).reply(StatusCodes.NOT_FOUND);

        await store.dispatch(fetchNearbyOffers('nonExistentOfferId'));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          fetchNearbyOffers.pending.type,
          fetchNearbyOffers.rejected.type,
        ]);
      });
    });

    describe('fetchOffer', () => {
      it('should dispatch "fetchOffer.pending", "fetchOffer.fulfilled" and return offer data when server responds with 200', async () => {
        const mockOffer = getMockOffer();
        mockAPIAdapter.onGet(`${APIRoute.Offers}/existingOfferId`).reply(StatusCodes.OK, mockOffer);

        await store.dispatch(fetchOffer('existingOfferId'));
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const fetchOfferFulfilled = dispatchedActions[1] as ReturnType<typeof fetchOffer.fulfilled>;

        expect(actionsTypes).toEqual([
          fetchOffer.pending.type,
          fetchOffer.fulfilled.type,
        ]);
        expect(fetchOfferFulfilled.payload).toEqual(mockOffer);
      });

      it('should dispatch "fetchOffer.pending", "fetchOffer.rejected" when server responds with 404', async () => {
        mockAPIAdapter.onGet(`${APIRoute.Offers}/nonExistentOfferId`).reply(StatusCodes.NOT_FOUND);

        await store.dispatch(fetchOffer('nonExistentOfferId'));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          fetchOffer.pending.type,
          fetchOffer.rejected.type,
        ]);
      });
    });
  });

  describe('favorites actions', () => {
    describe('fetchFavorites', () => {
      it('should dispatch "fetchFavorites.pending", "fetchFavorites.fulfilled" and return offers array when server responds with 200', async () => {
        const mockOffers = getMockOffers(2);
        mockAPIAdapter.onGet(APIRoute.Favorites).reply(StatusCodes.OK, mockOffers);

        await store.dispatch(fetchFavorites());
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const fetchFavoritesFulfilled = dispatchedActions[1] as ReturnType<typeof fetchFavorites.fulfilled>;

        expect(actionsTypes).toEqual([
          fetchFavorites.pending.type,
          fetchFavorites.fulfilled.type,
        ]);
        expect(fetchFavoritesFulfilled.payload).toEqual(mockOffers);
      });

      it('should dispatch "fetchFavorites.pending" and "fetchFavorites.rejected" when server responds with 401', async () => {
        mockAPIAdapter.onGet(APIRoute.Favorites).reply(StatusCodes.UNAUTHORIZED);

        await store.dispatch(fetchFavorites());
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          fetchFavorites.pending.type,
          fetchFavorites.rejected.type,
        ]);
      });
    });

    describe('changeFavoriteStatus', () => {
      it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.fulfilled" and return offer data when offer is removed from favorites and server response 200', async () => {
        const mockOffer = getMockOffer({ isFavorite: true });
        const mockChangedOffer = { ...mockOffer, isFavorite: false };
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${FavoriteStatus.Off}`)
          .reply(StatusCodes.CREATED, mockChangedOffer);

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.Off }));
        const dispatchedActions = store.getActions();
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
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${FavoriteStatus.On}`)
          .reply(StatusCodes.CREATED, mockChangedOffer);

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.On }));
        const dispatchedActions = store.getActions();
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
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${wrongFavoriteStatus}`)
          .reply(StatusCodes.BAD_REQUEST);

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: wrongFavoriteStatus }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          changeFavoriteStatus.pending.type,
          changeFavoriteStatus.rejected.type,
        ]);

      });

      it('should call "toast.warn" once with error message when server responds with 400', async () => {
        const wrongFavoriteStatus = 2 as FavoriteStatus;
        const errorMessage = 'bad request';
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${wrongFavoriteStatus}`)
          .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: wrongFavoriteStatus }));

        expect(toast.warn).toHaveBeenCalledTimes(1);
        expect(toast.warn).toHaveBeenCalledWith(errorMessage);
      });

      it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected" when server responds with 401', async () => {
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${FavoriteStatus.On}`)
          .reply(StatusCodes.UNAUTHORIZED);

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: FavoriteStatus.On }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          changeFavoriteStatus.pending.type,
          changeFavoriteStatus.rejected.type,
        ]);
      });

      it('should dispatch "changeFavoriteStatus.pending" and "changeFavoriteStatus.rejected" when server responds with 404', async () => {
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/nonExistentOfferId/${FavoriteStatus.On}`)
          .reply(StatusCodes.NOT_FOUND);

        await store.dispatch(changeFavoriteStatus({ offerId: 'nonExistentOfferId', status: FavoriteStatus.On }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          changeFavoriteStatus.pending.type,
          changeFavoriteStatus.rejected.type,
        ]);
      });

      it('should dispatch "changeFavoriteStatus.pending", "changeFavoriteStatus.rejected" when server responds with 409', async () => {
        const currentFavoriteStatus = true;
        const targetFavoriteStatus = +currentFavoriteStatus;
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${targetFavoriteStatus}`)
          .reply(StatusCodes.CONFLICT);

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: targetFavoriteStatus }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          changeFavoriteStatus.pending.type,
          changeFavoriteStatus.rejected.type,
        ]);
      });

      it('should call "toast.warn" once with error message when server responds with 409', async () => {
        const currentFavoriteStatus = true;
        const targetFavoriteStatus = +currentFavoriteStatus;
        const errorMessage = 'conflict';
        mockAPIAdapter.onPost(`${APIRoute.Favorites}/existingOfferId/${targetFavoriteStatus}`)
          .reply(StatusCodes.CONFLICT, { message: errorMessage });

        await store.dispatch(changeFavoriteStatus({ offerId: 'existingOfferId', status: targetFavoriteStatus }));

        expect(toast.warn).toHaveBeenCalledTimes(1);
        expect(toast.warn).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('reviews actions', () => {
    describe('fetchReviews', () => {
      it('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" and return reviews array when server responds with 200', async () => {
        const mockReviews = getMockReviews(2);
        mockAPIAdapter.onGet(`${APIRoute.Reviews}/existingOfferId`).reply(StatusCodes.OK, mockReviews);

        await store.dispatch(fetchReviews('existingOfferId'));
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const fetchReviewsFulfilled = dispatchedActions[1] as ReturnType<typeof fetchReviews.fulfilled>;

        expect(actionsTypes).toEqual([
          fetchReviews.pending.type,
          fetchReviews.fulfilled.type,
        ]);
        expect(fetchReviewsFulfilled.payload).toEqual(mockReviews);
      });

      it('should dispatch "fetchReviews.pending" and "fetchReviews.rejected" when server responds with 404', async () => {
        mockAPIAdapter.onGet(`${APIRoute.Reviews}/nonExistentOfferId`).reply(StatusCodes.NOT_FOUND);

        await store.dispatch(fetchReviews('nonExistentOfferId'));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          fetchReviews.pending.type,
          fetchReviews.rejected.type,
        ]);
      });
    });

    describe('submitReview', () => {
      it('should dispatch "submitReview.pending", "submitReview.fulfilled" and return review when server responds with 201', async () => {
        const mockNewReview = getMockReview();
        const mockNewReviewContent = { rating: mockNewReview.rating, comment: mockNewReview.comment };
        mockAPIAdapter.onPost(`${APIRoute.Reviews}/existingOfferId`).reply(StatusCodes.CREATED, mockNewReview);

        await store.dispatch(submitReview({ offerId: 'existingOfferId', content: mockNewReviewContent }));
        const dispatchedActions = store.getActions();
        const actionsTypes = extractActionsTypes(dispatchedActions);
        const submitReviewFulfilled = dispatchedActions[1] as ReturnType<typeof submitReview.fulfilled>;

        expect(actionsTypes).toEqual([
          submitReview.pending.type,
          submitReview.fulfilled.type,
        ]);
        expect(submitReviewFulfilled.payload).toEqual(mockNewReview);
      });

      it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 400', async () => {
        const mockReviewContent = { rating: 0, comment: 'comment text with invalid length' };
        mockAPIAdapter.onPost(`${APIRoute.Reviews}/nonExistentOfferId`).reply(StatusCodes.BAD_REQUEST);

        await store.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          submitReview.pending.type,
          submitReview.rejected.type,
        ]);
      });

      it('should call "toast.warn" once with error message when server responds with 400', async () => {
        const mockReviewContent = { rating: 0, comment: 'comment text with invalid length' };
        const errorMessage = 'bad request';
        mockAPIAdapter.onPost(`${APIRoute.Reviews}/nonExistentOfferId`)
          .reply(StatusCodes.BAD_REQUEST, { message: errorMessage });

        await store.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));

        expect(toast.warn).toHaveBeenCalledTimes(1);
        expect(toast.warn).toHaveBeenCalledWith(errorMessage);
      });

      it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 401', async () => {
        const mockReviewContent = { rating: 5, comment: 'comment text with valid length' };
        mockAPIAdapter.onPost(`${APIRoute.Reviews}/nonExistentOfferId`).reply(StatusCodes.UNAUTHORIZED);

        await store.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          submitReview.pending.type,
          submitReview.rejected.type,
        ]);
      });

      it('should dispatch "submitReview.pending" and "submitReview.rejected" when server responds with 404', async () => {
        const mockReviewContent = { rating: 5, comment: 'comment text with valid length' };
        mockAPIAdapter.onPost(`${APIRoute.Reviews}/nonExistentOfferId`).reply(StatusCodes.NOT_FOUND);

        await store.dispatch(submitReview({ offerId: 'nonExistentOfferId', content: mockReviewContent }));
        const actionsTypes = extractActionsTypes(store.getActions());

        expect(actionsTypes).toEqual([
          submitReview.pending.type,
          submitReview.rejected.type,
        ]);
      });
    });
  });
});
