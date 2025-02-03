'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
const chartData = [
  { bulan: 'Januari', suhu: 28.5, kelembapan: 65, co2: 420 },
  { bulan: 'Februari', suhu: 29.1, kelembapan: 63, co2: 435 },
  { bulan: 'Maret', suhu: 30.2, kelembapan: 60, co2: 450 },
  { bulan: 'April', suhu: 31.0, kelembapan: 58, co2: 465 },
  { bulan: 'Mei', suhu: 31.5, kelembapan: 55, co2: 480 },
  { bulan: 'Juni', suhu: 31.8, kelembapan: 53, co2: 490 }
];

const chartConfig = {
  suhu: {
    label: 'Suhu',
    color: 'hsl(var(--chart-1))'
  },
  kelembapan: {
    label: 'Kelembapan',
    color: 'hsl(var(--chart-2))'
  },
  co2: {
    label: 'CO₂',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Tren Sensor Lingkungan</CardTitle>
        <CardDescription>
          Fluktuasi bulanan parameter lingkungan (Jan-Juni 2024)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='bulan'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='suhu'
              type='natural'
              fill='var(--color-suhu)'
              fillOpacity={0.4}
              stroke='var(--color-suhu)'
              stackId='a'
            />
            <Area
              dataKey='kelembapan'
              type='natural'
              fill='var(--color-kelembapan)'
              fillOpacity={0.4}
              stroke='var(--color-kelembapan)'
              stackId='a'
            />
            <Area
              dataKey='co2'
              type='natural'
              fill='var(--color-co2)'
              fillOpacity={0.4}
              stroke='var(--color-co2)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Kenaikan tren 5.2% bulan ini <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              Periode Januari - Juni 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
