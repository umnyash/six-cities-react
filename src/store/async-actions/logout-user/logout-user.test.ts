import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { apiPaths } from '../../../services/api';
import * as tokenStorage from '../../../services/token';
import { createMockStore, extractActionsTypes } from '../../../tests/util';

import { logoutUser } from './logout-user';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: logoutUser', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onDelete(apiPaths.logout()).networkError();

    await mockStore.dispatch(logoutUser());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "logoutUser.pending" and "logoutUser.fulfilled" when server responds with 204', async () => {
    mockAPIAdapter.onDelete(apiPaths.logout()).reply(StatusCodes.NO_CONTENT);

    await mockStore.dispatch(logoutUser());
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      logoutUser.pending.type,
      logoutUser.fulfilled.type,
    ]);
  });

  it('should call "dropToken" once on logout', async () => {
    mockAPIAdapter.onDelete(apiPaths.logout()).reply(StatusCodes.NO_CONTENT);
    const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

    await mockStore.dispatch(logoutUser());

    expect(mockDropToken).toHaveBeenCalledTimes(1);
  });
});
