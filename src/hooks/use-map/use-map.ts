import { RefObject, useEffect, useState, useRef } from 'react';
import { Map, TileLayer } from 'leaflet';
import { Location } from '../../types/offers';
import { TILE_LAYER, COPYRIGHT } from './const';

function useMap<T extends HTMLElement>(mapRef: RefObject<T>, location: Location) {
  const [map, setMap] = useState<Map | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current || isInitializedRef.current) {
      return;
    }

    const mapInstance = new Map(mapRef.current, {
      center: {
        lat: location.latitude,
        lng: location.longitude,
      },
      zoom: location.zoom,
    });

    new TileLayer(TILE_LAYER, { attribution: COPYRIGHT }).addTo(mapInstance);

    setMap(mapInstance);
    isInitializedRef.current = true;
  }, [mapRef, map, location]);

  return map;
}

export default useMap;
