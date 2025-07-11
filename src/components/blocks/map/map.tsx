import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';

import { Location, Points } from '../../../types/offers';
import { useMap, useMapMarkers, useMapView } from '../../../hooks';

type MapProps = {
  className: string;
  location: Location;
  points: Points;
  activePointId?: string;
}

function Map(props: MapProps): JSX.Element {
  const { location, points, activePointId, className } = props;

  const mapRef = useRef<HTMLElement | null>(null);
  const map = useMap(mapRef, location);
  useMapView(map, location);
  useMapMarkers(map, points, activePointId);

  const mapClassName = clsx(
    'map',
    className && className
  );

  return (
    <section ref={mapRef} className={mapClassName} data-testid="map"></section>
  );
}

export default Map;
