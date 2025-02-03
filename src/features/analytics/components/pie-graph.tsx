'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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
  {
    sensor: 'Suhu',
    pembacaan: 3560,
    warna: 'hsl(var(--chart-1))'
  },
  {
    sensor: 'Kelembapan',
    pembacaan: 2845,
    warna: 'hsl(var(--chart-2))'
  },
  {
    sensor: 'CO₂',
    pembacaan: 1920,
    warna: 'hsl(var(--chart-3))'
  },
  {
    sensor: 'Cahaya',
    pembacaan: 1575,
    warna: 'hsl(var(--chart-4))'
  }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.pembacaan, 0);
  }, []);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Distribusi Frekuensi Pembacaan Sensor</CardTitle>
        <CardDescription>Periode Pengukuran 6 Bulan</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[360px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='pembacaan'
              nameKey='sensor'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Total Pembacaan
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Kenaikan aktivitas 5.2% <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Menampilkan total pembacaan 6 bulan terakhir
        </div>
      </CardFooter>
    </Card>
  );
}
