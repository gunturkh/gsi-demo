'use client';
// Using Mapbox
import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import { BrickWallIcon } from 'lucide-react';
import Pin from './pin';
import { useRouter } from 'next/navigation';

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// City coordinates
const cities = [
  { name: 'Jakarta', longitude: 106.8456, latitude: -6.2088 },
  { name: 'Surabaya', longitude: 112.752, latitude: -7.2575 },
  { name: 'Batam', longitude: 104.03, latitude: 1.15 }
];

// Add bridge coordinates
const bridges = [
  { name: 'Suramadu Bridge', longitude: 112.699, latitude: -7.198 }, // Surabaya-Madura
  { name: 'Ampera Bridge', longitude: 104.757, latitude: -2.991 }, // Palembang
  { name: 'Barelang Bridge', longitude: 104.083, latitude: 0.933 } // Batam
];

const MapView = () => {
  const router = useRouter();

  const pins = React.useMemo(() => {
    return cities.map((city) => (
      <Marker
        anchor='bottom'
        key={city.name}
        longitude={city.longitude}
        latitude={city.latitude}
        onClick={() =>
          router.push(`/dashboard/sites/${encodeURIComponent(city.name)}`)
        }
      >
        <Pin size={20} />
      </Marker>
    ));
  }, [router]);

  const bridgePins = React.useMemo(() => {
    return bridges.map((bridge) => (
      <Marker
        anchor='bottom'
        key={bridge.name}
        longitude={bridge.longitude}
        latitude={bridge.latitude}
        onClick={() =>
          router.push(`/dashboard/sites/${encodeURIComponent(bridge.name)}`)
        }
      >
        <BrickWallIcon className='text-red-500' size={24} />
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
        style={{ width: '100%', height: 500, borderRadius: '10px' }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      >
        {pins}
        {bridgePins}
      </Map>
    </>
  );
};

export default MapView;
