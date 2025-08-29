import { screen, render } from '@testing-library/react';
import { getRandomLocation, getMockPoints } from '../../../data/mocks';
import { useMap, useMapMarkers, useMapView } from '../../../hooks';

import Map from './map';

vi.mock('../../../hooks', () => ({
  useMap: vi.fn(() => 'mock-map-instance'),
  useMapMarkers: vi.fn(),
  useMapView: vi.fn(),
}));

describe('Component: Map', () => {
  const mapElementTestId = 'map';
  const mapSomeClass = 'offer__map';
  const mockLocation = getRandomLocation();
  const mockPoints = getMockPoints(4);
  const mockActivePointId = mockPoints[2].id;

  it('should render correctly', () => {
    render(<Map className={mapSomeClass} location={mockLocation} points={mockPoints} />);
    const mapElement = screen.getByTestId(mapElementTestId);

    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveClass(mapSomeClass);
  });

  it('should call hooks for map initialization', () => {
    render(
      <Map
        className={mapSomeClass}
        location={mockLocation}
        points={mockPoints}
        activePointId={mockActivePointId}
      />
    );
    const mapElement = screen.getByTestId(mapElementTestId);

    expect(useMap).toHaveBeenCalledWith({ current: mapElement }, mockLocation);
    expect(useMapView).toHaveBeenCalledWith('mock-map-instance', mockLocation);
    expect(useMapMarkers).toHaveBeenCalledWith('mock-map-instance', mockPoints, mockActivePointId);
  });
});
