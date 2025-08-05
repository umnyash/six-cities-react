import { renderHook } from '@testing-library/react';
import { Map } from 'leaflet';
import { Mock } from 'vitest';

import { Location } from '../../types/offers';
import { getRandomLocation } from '../../mocks/data';

import { useMapView } from './use-map-view';

describe('Hook: useMapView', () => {
  type HookProps = {
    map: Map | null;
    location: Location;
  }

  const mockLocations = [getRandomLocation(), getRandomLocation()];

  it('should safely handle null map without errors', () => {
    const mockMap = null;

    expect(() => {
      renderHook(() => useMapView(mockMap, mockLocations[0]));
    }).not.toThrow();
  });

  it('should call map\'s setView method if map is created', () => {
    const mockMap = { setView: vi.fn() } as unknown as Map;
    const mockLocation = mockLocations[0];

    renderHook(() => useMapView(mockMap, mockLocation));

    expect(mockMap.setView).toHaveBeenCalledWith(
      {
        lat: mockLocation.latitude,
        lng: mockLocation.longitude,
      },
      mockLocation.zoom
    );
  });

  it('should call setView when props change', () => {
    const mockMap = { setView: vi.fn() } as unknown as Map;

    const { rerender } = renderHook(
      ({ map, location }) => useMapView(map, location),
      { initialProps: { map: null, location: mockLocations[0] } as HookProps }
    );
    rerender({ map: mockMap, location: mockLocations[0] });
    rerender({ map: mockMap, location: mockLocations[1] });
    const setViewCalls = (mockMap.setView as Mock).mock.calls;

    expect(setViewCalls).toHaveLength(2);

    setViewCalls.forEach((call, index) => {
      expect(call).toEqual([
        {
          lat: mockLocations[index].latitude,
          lng: mockLocations[index].longitude,
        },
        mockLocations[index].zoom
      ]);
    });
  });
});
