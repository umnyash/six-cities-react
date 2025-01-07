import { useEffect } from 'react';
import { Map } from 'leaflet';
import { Location } from '../../types/offers';

function useMapView(map: Map | null, location: Location) {
  useEffect(() => {
    if (!map) {
      return;
    }

    map.setView({
      lat: location.latitude,
      lng: location.longitude,
    }, location.zoom);
  }, [map, location]);
}

export default useMapView;
