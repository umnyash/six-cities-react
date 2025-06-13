import { NameSpace, RequestStatus } from '../../const';
import { getOffer, getOfferLoadingStatus } from './offer.selectors';

describe('Offer selectors', () => {
  const nameSpace = NameSpace.Offer;

  const state = {
    [nameSpace]: {
      offer: null,
      loadingStatus: RequestStatus.Success,
    }
  };

  it('should return offer from state', () => {
    const { offer } = state[nameSpace];
    const result = getOffer(state);
    expect(result).toEqual(offer);
  });

  it('should return offer loading status from state', () => {
    const { loadingStatus } = state[nameSpace];
    const result = getOfferLoadingStatus(state);
    expect(result).toEqual(loadingStatus);
  });
});
