'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  {
    tanggal: '2024-06-01',
    suhu: 28.5,
    kelembapan: 65,
    cahaya: 1200
  },
  {
    tanggal: '2024-06-02',
    suhu: 29.1,
    kelembapan: 63,
    cahaya: 1150
  },
  {
    tanggal: '2024-06-03',
    suhu: 30.2,
    kelembapan: 60,
    cahaya: 1100
  },
  {
    tanggal: '2024-06-04',
    suhu: 31.0,
    kelembapan: 58,
    cahaya: 1050
  },
  {
    tanggal: '2024-06-05',
    suhu: 31.5,
    kelembapan: 55,
    cahaya: 1000
  },
  {
    tanggal: '2024-06-06',
    suhu: 31.8,
    kelembapan: 53,
    cahaya: 950
  },
  {
    tanggal: '2024-06-07',
    suhu: 32.0,
    kelembapan: 50,
    cahaya: 900
  },
  {
    tanggal: '2024-06-08',
    suhu: 32.2,
    kelembapan: 48,
    cahaya: 850
  },
  {
    tanggal: '2024-06-09',
    suhu: 32.5,
    kelembapan: 45,
    cahaya: 800
  },
  {
    tanggal: '2024-06-10',
    suhu: 32.7,
    kelembapan: 43,
    cahaya: 750
  },
  {
    tanggal: '2024-06-11',
    suhu: 32.8,
    kelembapan: 40,
    cahaya: 700
  },
  {
    tanggal: '2024-06-12',
    suhu: 32.9,
    kelembapan: 38,
    cahaya: 650
  },
  {
    tanggal: '2024-06-13',
    suhu: 33.0,
    kelembapan: 35,
    cahaya: 600
  },
  {
    tanggal: '2024-06-14',
    suhu: 33.1,
    kelembapan: 33,
    cahaya: 550
  },
  {
    tanggal: '2024-06-15',
    suhu: 33.2,
    kelembapan: 30,
    cahaya: 500
  },
  {
    tanggal: '2024-06-16',
    suhu: 33.3,
    kelembapan: 28,
    cahaya: 450
  },
  {
    tanggal: '2024-06-17',
    suhu: 33.4,
    kelembapan: 25,
    cahaya: 400
  },
  {
    tanggal: '2024-06-18',
    suhu: 33.5,
    kelembapan: 23,
    cahaya: 350
  },
  {
    tanggal: '2024-06-19',
    suhu: 33.6,
    kelembapan: 20,
    cahaya: 300
  },
  {
    tanggal: '2024-06-20',
    suhu: 33.7,
    kelembapan: 18,
    cahaya: 250
  },
  {
    tanggal: '2024-06-21',
    suhu: 33.8,
    kelembapan: 15,
    cahaya: 200
  },
  {
    tanggal: '2024-06-22',
    suhu: 33.9,
    kelembapan: 13,
    cahaya: 150
  },
  {
    tanggal: '2024-06-23',
    suhu: 34.0,
    kelembapan: 10,
    cahaya: 100
  },
  {
    tanggal: '2024-06-24',
    suhu: 34.1,
    kelembapan: 8,
    cahaya: 50
  },
  {
    tanggal: '2024-06-25',
    suhu: 34.2,
    kelembapan: 5,
    cahaya: 0
  },
  {
    tanggal: '2024-06-26',
    suhu: 34.3,
    kelembapan: 3,
    cahaya: 0
  },
  {
    tanggal: '2024-06-27',
    suhu: 34.4,
    kelembapan: 2,
    cahaya: 0
  },
  {
    tanggal: '2024-06-28',
    suhu: 34.5,
    kelembapan: 1,
    cahaya: 0
  },
  {
    tanggal: '2024-06-29',
    suhu: 34.6,
    kelembapan: 0,
    cahaya: 0
  },
  {
    tanggal: '2024-06-30',
    suhu: 34.7,
    kelembapan: 0,
    cahaya: 0
  }
];

const chartConfig = {
  suhu: {
    label: 'Suhu (°C)',
    color: 'hsl(var(--chart-1))'
  },
  kelembapan: {
    label: 'Kelembapan (%)',
    color: 'hsl(var(--chart-2))'
  },
  cahaya: {
    label: 'Intensitas Cahaya (lux)',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('suhu');

  const total = React.useMemo(
    () => ({
      suhu: chartData.reduce((acc, curr) => acc + curr.suhu, 0),
      kelembapan: chartData.reduce((acc, curr) => acc + curr.kelembapan, 0),
      cahaya: chartData.reduce((acc, curr) => acc + curr.cahaya, 0)
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // React.useEffect(() => {
  //   if (activeChart === 'error') {
  //     throw new Error('Mocking Error');
  //   }
  // }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Grafik Harian Pembacaan Sensor</CardTitle>
          <CardDescription>
            Fluktuasi harian parameter lingkungan Juni 2024
          </CardDescription>
        </div>
        <div className='flex'>
          {['suhu', 'kelembapan', 'cahaya'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-xs text-muted-foreground'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg font-bold leading-none sm:text-3xl'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='tanggal'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
