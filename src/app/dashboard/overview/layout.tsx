import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/features/overview/components/map';
import React from 'react';
import { Building, Camera, AlertTriangle, Wifi } from 'lucide-react';

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
                Site Terpasang
              </CardTitle>
              <Building className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>248</div>
              <p className='text-xs text-muted-foreground'>
                Total lokasi pemasangan
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
                  <div className='text-2xl font-bold'>1,892</div>
                  <p className='text-xs text-muted-foreground'>Aktif</p>
                </div>
                <div>
                  <div className='text-2xl font-bold'>23</div>
                  <p className='text-xs text-muted-foreground'>Tidak Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Laporan Hari Ini
              </CardTitle>
              <AlertTriangle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='space-y-1'>
                <div className='flex justify-between'>
                  <span>Sensor</span>
                  <span className='font-medium'>15</span>
                </div>
                <div className='flex justify-between'>
                  <span>Kamera</span>
                  <span className='font-medium'>8</span>
                </div>
                <div className='flex justify-between'>
                  <span>Sistem</span>
                  <span className='font-medium'>3</span>
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
        <MapView />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
