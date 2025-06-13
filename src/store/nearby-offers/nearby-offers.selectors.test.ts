import { NameSpace, RequestStatus } from '../../const';
import { getMockOffers } from '../../mocks/data';
import { getNearbyOffers, getNearbyOffersLoadingStatus } from './nearby-offers.selectors';

describe('Nearby offers selectors', () => {
  const nameSpace = NameSpace.NearbyOffers;

  const state = {
    [nameSpace]: {
      offers: getMockOffers(2),
      loadingStatus: RequestStatus.Success,
    }
  };

  it('should return offers from state', () => {
    const { offers } = state[nameSpace];
    const result = getNearbyOffers(state);
    expect(result).toEqual(offers);
  });

  it('should return nearby offers loading status from state', () => {
    const { loadingStatus } = state[nameSpace];
    const result = getNearbyOffersLoadingStatus(state);
    expect(result).toBe(loadingStatus);
  });
});
