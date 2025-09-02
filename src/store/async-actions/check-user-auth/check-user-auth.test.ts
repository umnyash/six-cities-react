import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

import { AuthUser } from '../../../types/user';
import { apiPaths } from '../../../services/api';
import { getMockAuthUser } from '../../../data/mocks';
import { createMockStore, extractActionsTypes } from '../../../tests/util';
import { omit } from '../../../util';

import { checkUserAuth } from './check-user-auth';

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  }
}));

describe('Async action: checkUserAuth', () => {
  let mockStore: ReturnType<typeof createMockStore>['mockStore'];
  let mockAPIAdapter: ReturnType<typeof createMockStore>['mockAPIAdapter'];

  beforeEach(() => {
    ({ mockStore, mockAPIAdapter } = createMockStore());
    vi.clearAllMocks();
  });

  it('should call "toast.warn" with error message on network failure', async () => {
    const networkErrorMessage = /Network error/i;
    mockAPIAdapter.onGet(apiPaths.login()).networkError();

    await mockStore.dispatch(checkUserAuth());

    expect(toast.warn).toHaveBeenCalledTimes(1);
    expect(toast.warn).toHaveBeenCalledWith(expect.stringMatching(networkErrorMessage));
  });

  it('should dispatch "checkUserAuth.pending", "checkUserAuth.fulfilled" and return user data when server responds with 200', async () => {
    const mockAuthUser: AuthUser = getMockAuthUser();
    const mockUser = omit(mockAuthUser, 'token');
    mockAPIAdapter.onGet(apiPaths.login()).reply(StatusCodes.OK, mockAuthUser);

    await mockStore.dispatch(checkUserAuth());
    const dispatchedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(dispatchedActions);
    const checkUserAuthFulfilled = dispatchedActions[1] as ReturnType<typeof checkUserAuth.fulfilled>;

    expect(actionsTypes).toEqual([
      checkUserAuth.pending.type,
      checkUserAuth.fulfilled.type,
    ]);
    expect(checkUserAuthFulfilled.payload).toMatchObject(mockUser);
  });

  it('should dispatch "checkUserAuth.pending" and "checkUserAuth.rejected" when server responds with 401', async () => {
    mockAPIAdapter.onGet(apiPaths.login()).reply(StatusCodes.UNAUTHORIZED);

    await mockStore.dispatch(checkUserAuth());
    const actionsTypes = extractActionsTypes(mockStore.getActions());

    expect(actionsTypes).toEqual([
      checkUserAuth.pending.type,
      checkUserAuth.rejected.type,
    ]);
  });
});
