import { NameSpace, RequestStatus } from '../../const';
import { getMockOffers } from '../../mocks/util';
import { getFavorites, getFavoritesLoadingStatus, getChangingOffersIds } from './favorites.selectors';

describe('Favorites selectors', () => {
  const nameSpace = NameSpace.Favorites;

  const state = {
    [nameSpace]: {
      favorites: getMockOffers(4),
      loadingStatus: RequestStatus.Success,
      changingOffersIds: ['id1', 'id2'],
    },
  };

  it('should return favorites offers from state', () => {
    const { favorites } = state[nameSpace];
    const result = getFavorites(state);
    expect(result).toEqual(favorites);
  });

  it('should return favorites loading status from state', () => {
    const { loadingStatus } = state[nameSpace];
    const result = getFavoritesLoadingStatus(state);
    expect(result).toBe(loadingStatus);
  });

  it('should return changins status offers ids', () => {
    const { changingOffersIds } = state[nameSpace];
    const result = getChangingOffersIds(state);
    expect(result).toEqual(changingOffersIds);
  });
});
