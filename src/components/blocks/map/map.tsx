import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';

import { Location, Points } from '../../../types/offers';
import useMap from '../../../hooks/use-map';
import useMapView from '../../../hooks/use-map-view';
import useMapMarkers from '../../../hooks/use-map-markers';

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
    <section ref={mapRef} className={mapClassName}></section>
  );
}

export default Map;
