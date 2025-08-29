import { screen, render, renderHook } from '@testing-library/react';
import { Map } from 'leaflet';

import { getRandomLocation } from '../../data/mocks';

import { useMap } from './use-map';

describe('Hook: useMap', () => {
  const MockMap = () => <div data-testid="map"></div>;
  const mockLocation1 = getRandomLocation();
  const mockLocation2 = getRandomLocation();

  it('should not initialize map when map element is null', () => {
    const { result } = renderHook(() => useMap({ current: null }, mockLocation1));
    const map = result.current;

    expect(map).toBe(null);
  });

  it('should initialize map correctly', () => {
    render(<MockMap />);
    const mapElement = screen.getByTestId('map');
    const { result } = renderHook(() => useMap({ current: mapElement }, mockLocation1));
    const map = result.current;

    expect(map).toBeInstanceOf(Map);
    expect(mapElement).not.toBeEmptyDOMElement();
  });

  it('should initialize map only once', () => {
    render(<MockMap />);
    const mapElement = screen.getByTestId('map');
    const { result, rerender } = renderHook(
      ({ location }) => useMap({ current: mapElement }, location),
      { initialProps: { location: mockLocation1 } }
    );
    const firstRenderedMap = result.current;
    rerender({ location: mockLocation2 });
    const secondRenderedMap = result.current;

    expect(firstRenderedMap).toBe(secondRenderedMap);
  });
});
