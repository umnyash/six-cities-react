import { renderHook } from '@testing-library/react';
import { Map, Marker, MarkerOptions, layerGroup } from 'leaflet';

import { getMockPoints } from '../../mocks/data';

import { useMapMarkers } from './use-map-markers';

vi.mock('leaflet', async () => {
  const actual = await vi.importActual('leaflet');

  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(),
    remove: vi.fn(),
  };

  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
  };

  return {
    ...actual,
    layerGroup: vi.fn(() => mockLayerGroup),
    Marker: vi.fn(() => mockMarker),
  };
});

describe('Hook: useMapMarkers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  type PartialMarkerOptions = Pick<MarkerOptions, 'icon'>;

  const extractIconUrl = (markerOptions: PartialMarkerOptions): string =>
    markerOptions.icon!.options.iconUrl!;

  it('should not add markers if map has not been created', () => {
    const mockPoints = getMockPoints(2);

    renderHook(() => useMapMarkers(null, mockPoints));

    expect(layerGroup).not.toHaveBeenCalled();
    expect(Marker).not.toHaveBeenCalled();
  });

  it.each([
    {
      case: '(all markers are inactive)',
    },
    {
      case: '(marker with index 0 is active)',
      activePointIndex: 0,
    },
    {
      case: '(marker with index 1 is active)',
      activePointIndex: 1,
    },
  ])(
    'should add point markers to map $case and clear and remove markers layer on unmount',
    ({ activePointIndex }) => {
      const mockPoints = getMockPoints(3);
      const mockActivePointId = mockPoints[activePointIndex as number]?.id;
      const mockMap = { removeLayer: vi.fn() } as unknown as Map;
      const markersLayer = layerGroup();

      const { unmount } = renderHook(() =>
        useMapMarkers(mockMap, mockPoints, mockActivePointId)
      );

      // A layer for markers must be created.
      expect(layerGroup).toHaveBeenCalled();

      // A layer for markers must be added to the map.
      expect(markersLayer.addTo).toHaveBeenCalledWith(mockMap);

      // A marker must be created for each point.
      const mockMarkerCalls = vi.mocked(Marker).mock.calls;
      expect(mockMarkerCalls).toHaveLength(mockPoints.length);
      mockMarkerCalls.forEach(([latlng, markerOptions], index) => {
        const { location: { latitude, longitude } } = mockPoints[index];
        const { lat, lng } = latlng as { lat: number; lng: number };
        const iconUrl = extractIconUrl(markerOptions as PartialMarkerOptions);
        // const expectedIconUrl = markerIconUrls[index];

        const expectedIconUrl = activePointIndex === index ? 'img/pin-active.svg' : 'img/pin.svg';

        expect(lat).toBe(latitude);
        expect(lng).toBe(longitude);
        expect(iconUrl).toBe(expectedIconUrl);
      });

      // Markers must be added to the marker layer.
      const mockMarkers = vi.mocked(Marker).mock.results.map(({ value }) => value as unknown as Marker);
      mockMarkers.forEach((marker) => {
        expect(marker.addTo).toHaveBeenCalledWith(markersLayer);
      });

      unmount();

      // The marker layer must be cleared.
      expect(markersLayer.clearLayers).toHaveBeenCalled();

      // The marker layer must be removed from the map.
      expect(mockMap.removeLayer).toHaveBeenCalledWith(markersLayer);
    }
  );
});
