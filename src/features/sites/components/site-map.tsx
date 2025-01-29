'use client';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { Gauge, Camera, Wrench } from 'lucide-react';

const SENSORS = [
  { type: 'vibration', lat: -6.2088, lng: 106.8456, icon: <Gauge /> },
  { type: 'camera', lat: -6.2089, lng: 106.846, icon: <Camera /> },
  { type: 'equipment', lat: -6.2087, lng: 106.8452, icon: <Wrench /> }
];

export default function SiteMap({
  initialLat,
  initialLng
}: {
  initialLat: number;
  initialLng: number;
}) {
  return (
    <div className='h-[600px] w-full overflow-hidden rounded-lg'>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: initialLng,
          latitude: initialLat,
          zoom: 16,
          pitch: 60,
          bearing: 0
        }}
        mapStyle='mapbox://styles/mapbox/satellite-v9'
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <NavigationControl />
        {SENSORS.map((sensor, sensorIdx) => (
          <Marker
            key={`${sensor.lat}-${sensor.lng}`}
            longitude={initialLng + 0.00024 * sensorIdx}
            latitude={initialLat + 0.00024 * sensorIdx}
          >
            <div className='rounded-full bg-background p-1 text-red-500'>
              {sensor.icon}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
