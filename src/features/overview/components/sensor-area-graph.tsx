'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

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
import { useRouter } from 'next/navigation';

async function getSensorData(sensorId: string) {
  const res = await fetch(
    `http://localhost:3000/api/sensor-data?id_sensor=${sensorId}`
  );
  if (!res.ok) throw new Error('Failed to fetch sensor data');
  return res.json();
}

export function SensorAreaGraph({
  sensorId,
  color = 'hsl(var(--chart-1))',
  satuan = 'Gal'
}: {
  sensorId: string;
  color?: string;
  satuan?: 'Gal' | 'Cm' | 'Microstrain' | 'Degree';
}) {
  const router = useRouter();
  const [sensorData, setSensorData] = useState<
    Array<{
      time: string;
      value: number;
      nama_sensor: string;
      satuan: 'Gal' | 'Cm' | 'Microstrain' | 'Degree';
    }>
  >([]);
  const [startIndex, setStartIndex] = useState(0);

  const chartConfig = {
    value: {
      label: 'Acceleration',
      color
    }
  } satisfies ChartConfig;

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % (sensorData.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [sensorData.length]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSensorData(sensorId);
      setSensorData(data);
      setStartIndex(0); // Reset index when new data loads
    };
    fetchData();
  }, [sensorId]);

  return (
    <Card
      onClick={() => router.push(`/dashboard/sensors/${sensorId}`)}
      className='cursor-pointer'
    >
      <CardHeader>
        <CardTitle>Sensor {sensorData[0]?.nama_sensor || ''}</CardTitle>
        <CardDescription>
          {satuan === 'Gal'
            ? 'Sensor data measured in Gal (1 Gal = 1 cm/s²)'
            : satuan === 'Microstrain'
              ? 'Microstrain (με) measurement of structural deformation'
              : satuan === 'Degree'
                ? 'Angular measurement in degrees (°)'
                : 'Displacement measurement in centimeters (cm)'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={sensorData.slice(startIndex, startIndex + 10)}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='time'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <YAxis
              dataKey='value'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} ${satuan}`}
              label={{
                value: 'Measurement',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                offset: 10
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='value'
              type='natural'
              fill={chartConfig.value.color}
              fillOpacity={0.4}
              stroke={chartConfig.value.color}
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Real-time acceleration data <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              {sensorData[startIndex]?.time} -{' '}
              {sensorData[startIndex + 9]?.time}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
