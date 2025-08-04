import { MemoryHistory, createMemoryHistory } from 'history';
import { StatusCodes } from 'http-status-codes';
import { screen, render, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import { AppRoute, RequestStatus, NameSpace, APP_ROUTE_PARAM_ID } from '../../../const';
import { State } from '../../../types/state';
import { getMockOffer } from '../../../mocks/data';
import { withHistory, withStore } from '../../../mocks/render-helpers';
import { apiPaths } from '../../../services/api';
import { extractActionsTypes } from '../../../mocks/util';
import { fetchOffer, fetchReviews, fetchNearbyOffers } from '../../../store/async-actions';

import OfferPage from './offer-page';

vi.mock('../loading-page', () => ({
  default: vi.fn(() => <h1>LoadingPage</h1>)
}));

vi.mock('../not-found-page', () => ({
  default: vi.fn(() => <h1>NotFoundPage</h1>)
}));

vi.mock('../../blocks/offer-page-content', () => ({
  default: vi.fn(() => <h1>OfferPageContent</h1>)
}));

describe('Component: OfferPage', () => {
  const mockOffer = getMockOffer();
  let mockInitialState: Pick<State, NameSpace.Offer | NameSpace.NearbyOffers>;
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.Offer]: {
        offer: null,
        loadingStatus: RequestStatus.None,
      },
      [NameSpace.NearbyOffers]: {
        offers: [],
        loadingStatus: RequestStatus.None,
      },
    };

    mockHistory = createMemoryHistory();

    vi.clearAllMocks();
  });

  it('should dispatch "fetchOffer", "fetchReview", "fetchNearbyOffers" actions on mount', async () => {
    const mockOfferId = 'some-offer-id';
    const mockOfferPath = AppRoute.Offer.replace(APP_ROUTE_PARAM_ID, mockOfferId);
    mockHistory.push(mockOfferPath);
    const withHistoryComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Offer} element={<OfferPage />} />
      </Routes>,
      mockHistory
    );
    const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(withHistoryComponent, mockInitialState);
    mockAPIAdapter.onGet(apiPaths.reviews('some-offer-id')).reply(StatusCodes.OK, []);
    mockAPIAdapter.onGet(apiPaths.offer('some-offer-id')).reply(StatusCodes.OK, mockOffer);
    mockAPIAdapter.onGet(apiPaths.nearbyOffers('some-offer-id')).reply(StatusCodes.OK, []);
    const expectedActionsTypes = [
      fetchOffer.pending.type,
      fetchOffer.fulfilled.type,
      fetchReviews.pending.type,
      fetchReviews.fulfilled.type,
      fetchNearbyOffers.pending.type,
      fetchNearbyOffers.fulfilled.type,
    ];

    render(withStoreComponent);

    await waitFor(() => {
      const actionsTypes = extractActionsTypes(mockStore.getActions());

      expect(actionsTypes).toEqual(expect.arrayContaining(expectedActionsTypes));
      expect(actionsTypes).toHaveLength(expectedActionsTypes.length);
    });
  });

  it.each([
    {
      case: 'should render only loading page when offer loading status is "Pending"',
      state: { loadingStatus: RequestStatus.Pending, offer: null },
      mockComponentHeading: 'LoadingPage',
    },
    {
      case: 'should render only offer and offers when loading status is "Success" and there are offer data',
      state: { loadingStatus: RequestStatus.Success, offer: mockOffer },
      mockComponentHeading: 'OfferPageContent',
    },
    {
      case: 'should render only not found page when offer loading status is "Error" or no offer data',
      state: { loadingStatus: RequestStatus.Error, offer: null },
      mockComponentHeading: 'NotFoundPage',
    },
  ])('$case', ({ state, mockComponentHeading }) => {
    const withHistoryComponent = withHistory(<OfferPage />, mockHistory);
    mockInitialState[NameSpace.Offer] = state;
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);

    render(withStoreComponent);
    const headingElement = screen.getByRole('heading');

    expect(headingElement).toHaveTextContent(mockComponentHeading);
  });

  it('should correctly pass props to nested OfferPageContent component', async () => {
    const withHistoryComponent = withHistory(<OfferPage />, mockHistory);
    mockInitialState[NameSpace.Offer] = { loadingStatus: RequestStatus.Success, offer: mockOffer };
    const { withStoreComponent } = withStore(withHistoryComponent, mockInitialState);
    const mockOfferPageContent = vi.mocked(await import('../../blocks/offer-page-content')).default;

    render(withStoreComponent);

    expect(mockOfferPageContent).toHaveBeenCalledWith({ offer: mockOffer }, expect.anything());
  });
});
