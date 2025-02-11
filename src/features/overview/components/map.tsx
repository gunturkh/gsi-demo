'use client';
// Using Mapbox
import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import Pin from './pin';
import { useRouter } from 'next/navigation';

const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapView = () => {
  const router = useRouter();

  const [cities, setCities] = React.useState<any>([]);
  const [selectedCity, setSelectedCity] = React.useState<any>(null);

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
        <div
          onMouseEnter={() => setSelectedCity(city)}
          onMouseLeave={() => setSelectedCity(null)}
        >
          <Pin size={30} />
        </div>
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

        {selectedCity && (
          <Popup
            latitude={selectedCity.latitude}
            longitude={selectedCity.longitude}
            anchor='bottom'
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedCity(null)}
            offset={25}
            style={{ padding: '0.5rem', pointerEvents: 'none' }}
          >
            <div className='text-sm font-medium text-black'>
              {selectedCity.name}
              {selectedCity?.data?.bridges && (
                <div className='text-muted-foreground'>
                  {selectedCity.data.bridges.length} perangkat
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default MapView;
