'use client';
// Using Mapbox
import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import { BrickWallIcon } from 'lucide-react';
import Pin from './pin';
import { useRouter } from 'next/navigation';

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapView = () => {
  const router = useRouter();

  const [cities, setCities] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    };

    fetchCities();
  }, []);

  const pins = React.useMemo(() => {
    return cities.map((city: any) => (
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
  }, [router, cities]);

  // const bridgePins = React.useMemo(() => {
  //   return bridges.map((bridge) => (
  //     <Marker
  //       anchor='bottom'
  //       key={bridge.name}
  //       longitude={bridge.longitude}
  //       latitude={bridge.latitude}
  //       onClick={() =>
  //         router.push(`/dashboard/sites/${encodeURIComponent(bridge.name)}`)
  //       }
  //     >
  //       <BrickWallIcon className='text-red-500' size={24} />
  //     </Marker>
  //   ));
  // }, []);

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
        {/* {bridgePins} */}
      </Map>
    </>
  );
};

export default MapView;
