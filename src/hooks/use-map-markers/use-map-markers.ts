import { useEffect } from 'react';
import { Map, Icon, layerGroup, Marker } from 'leaflet';
import { Points } from '../../types/offers';

const defaultIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [14, 39],
});

const activeIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [14, 39],
});

function useMapMarkers(map: Map | null, points: Points, activePointId?: string) {
  useEffect(() => {
    if (!map) {
      return;
    }

    const markerLayer = layerGroup().addTo(map);

    points.forEach(({ location, id }) => {
      new Marker({
        lat: location.latitude,
        lng: location.longitude
      }, {
        icon: (id === activePointId) ? activeIcon : defaultIcon,
      }).addTo(markerLayer);
    });

    return () => {
      markerLayer.clearLayers();
      map.removeLayer(markerLayer);
    };
  }, [map, points, activePointId]);
}

export default useMapMarkers;
