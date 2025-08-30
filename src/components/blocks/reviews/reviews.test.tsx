import { screen, render } from '@testing-library/react';

import { RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { getMockReviews } from '../../../data/mocks';
import { withHistory, withStore } from '../../../tests/render-helpers';

import Reviews from './reviews';

describe('Component: Reviews', () => {
  const withHistoryComponent = withHistory(<Reviews offerId='some-offer-id' />);
  let mockInitialState: Pick<State, NameSpace.User | NameSpace.Reviews>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.User]: {
        user: null,
        authorizationStatus: AuthorizationStatus.NoAuth,
        loggingInStatus: RequestStatus.None,
      },
      [NameSpace.Reviews]: {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.Success,
      }
    };
  });

  it('should render correctly when no reviews', () => {
    const expectedHeading = 'Reviews · 0';
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: expectedHeading }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should render correctly when there are reviews', () => {
    const mockReviews = getMockReviews(2);
    mockInitialState[NameSpace.Reviews].reviews = mockReviews;
    const expectedHeading = `Reviews · ${mockReviews.length}`;
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: expectedHeading }));
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockReviews.length);
  });

  describe('review form', () => {
    const reviewFormText = 'Your review';

    it('should not render review form when authorization status is "NO_AUTH"', () => {
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);
      render(withStoreComponent);
      expect(screen.queryByText(reviewFormText)).not.toBeInTheDocument();
    });

    it('should render review form when authorization status is "AUTH"', () => {
      mockInitialState[NameSpace.User].authorizationStatus = AuthorizationStatus.Auth;
      const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

      render(withStoreComponent);

      expect(screen.getByText(reviewFormText)).toBeInTheDocument();
    });
  });
});
