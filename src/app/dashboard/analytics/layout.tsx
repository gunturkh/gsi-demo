import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/features/overview/components/map';
import React from 'react';
import { Building, Camera, AlertTriangle, Wifi } from 'lucide-react';
import { SensorAreaGraph } from '@/features/overview/components/sensor-area-graph';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Perangkat Terpasang
              </CardTitle>
              <Building className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>248</div>
              <p className='text-xs text-muted-foreground'>
                Total perangkat IoT aktif
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Sensor & Kamera
              </CardTitle>
              <Camera className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='flex justify-between'>
                <div>
                  <div className='text-2xl font-bold'>1.235</div>
                  <p className='text-xs text-muted-foreground'>Pembacaan/mnt</p>
                </div>
                <div>
                  <div className='text-2xl font-bold'>98%</div>
                  <p className='text-xs text-muted-foreground'>Akurasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pembacaan Sensor
              </CardTitle>
              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='space-y-1'>
                <div className='flex justify-between'>
                  <span>Suhu</span>
                  <span className='font-medium'>32°C</span>
                </div>
                <div className='flex justify-between'>
                  <span>Kelembaban</span>
                  <span className='font-medium'>65%</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tekanan</span>
                  <span className='font-medium'>1013 hPa</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Status Koneksi
              </CardTitle>
              <Wifi className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-green-500' />
                <div className='text-2xl font-bold'>Terhubung</div>
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>
                Terakhir diperbarui: 12:45 WIB
              </p>
            </CardContent>
          </Card>
        </div>
        {/* <MapView /> */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='64' color='hsl(var(--chart-1))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='65' color='hsl(var(--chart-2))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='66' color='hsl(var(--chart-3))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='67' color='hsl(var(--chart-4))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='68' color='hsl(var(--chart-5))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='69' color='hsl(var(--chart-1))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='70'
              color='hsl(var(--chart-2))'
              satuan='Cm'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='71'
              color='hsl(var(--chart-3))'
              satuan='Cm'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='72'
              color='hsl(var(--chart-4))'
              satuan='Cm'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='73' color='hsl(var(--chart-5))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='74' color='hsl(var(--chart-1))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph sensorId='75' color='hsl(var(--chart-2))' />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='76'
              color='hsl(var(--chart-3))'
              satuan='Microstrain'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='77'
              color='hsl(var(--chart-4))'
              satuan='Microstrain'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='78'
              color='hsl(var(--chart-5))'
              satuan='Degree'
            />
          </div>
          <div className='col-span-1'>
            <SensorAreaGraph
              sensorId='79'
              color='hsl(var(--chart-1))'
              satuan='Degree'
            />
          </div>
          {/* <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div> */}
        </div>
      </div>
    </PageContainer>
  );
}
