'use client';
// Using Mapbox
import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import Pin from './pin';

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// City coordinates
const cities = [
  { name: 'Jakarta', longitude: 106.8456, latitude: -6.2088 },
  { name: 'Surabaya', longitude: 112.752, latitude: -7.2575 },
  { name: 'Batam', longitude: 104.03, latitude: 1.15 }
];

const MapView = () => {
  const pins = React.useMemo(() => {
    return cities.map((city) => (
      <Marker
        anchor='bottom'
        key={city.name}
        longitude={city.longitude}
        latitude={city.latitude}
      >
        <Pin size={20} />
      </Marker>
    ));
  }, []);
  return (
    <>
      <Map
        mapboxAccessToken={mapToken}
        initialViewState={{
          longitude: 118,
          latitude: -2.5,
          zoom: 4.2
        }}
        style={{ width: '100%', height: 800 }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      >
        {pins}
      </Map>
    </>
  );
};

export default MapView;
