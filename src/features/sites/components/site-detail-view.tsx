import PageContainer from '@/components/layout/page-container';
import SiteMap from './site-map';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const SITE_DATA = {
  'Suramadu Bridge': { lat: -7.198, lng: 112.699 },
  'Ampera Bridge': { lat: -2.991, lng: 104.757 },
  Batam: { lat: 0.9817595390017051, lng: 104.04156854077729 }
};

export default function SiteDetailView({ site }: { site: string }) {
  const coordinates = SITE_DATA[site as keyof typeof SITE_DATA];

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>{site} Monitoring</h1>

      <SiteMap initialLat={coordinates?.lat} initialLng={coordinates?.lng} />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Structural Health</CardTitle>
            <div className='space-y-2'>
              <div>Vibration: 2.5mm/s</div>
              <div>Strain: 450με</div>
              <div>Temperature: 32°C</div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <div className='space-y-2'>
              <div>Cameras: 12/15 Online</div>
              <div>Sensors: 98% Operational</div>
              <div>Power: Stable</div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental</CardTitle>
            <div className='space-y-2'>
              <div>Wind Speed: 15 km/h</div>
              <div>Humidity: 65%</div>
              <div>Rainfall: 0mm</div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
