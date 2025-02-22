'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
import { Skeleton } from '@/components/ui/skeleton';

async function getSensorData(sensorId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sensor-data?id_sensor=${sensorId}`
  );
  if (!res.ok) throw new Error('Failed to fetch sensor data');
  const data = await res.json();
  return {
    dataPoints: data,
    sensorName: data[0]?.nama_sensor || `Sensor ${sensorId}`,
    sensorUnit: data[0]?.satuan || 'Gal'
  };
}

async function getSensorSummary(
  data: Array<{ value: number }>,
  prompt: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analyze-sensor`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: data.map((d) => d.value),
        system_prompt: prompt
      })
    }
  );
  if (!res.ok) throw new Error('Gagal memproses analisis');
  return await res.text();
}

const chartConfig = {
  value: {
    label: 'Sensor Data',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function SensorAreaChart({ sensorId }: { sensorId: string }) {
  const [sensorData, setSensorData] = useState<
    Array<{ time: string; value: number }>
  >([]);
  const [sensorMeta, setSensorMeta] = useState<{ name: string; unit: string }>({
    name: `Sensor ${sensorId}`,
    unit: 'Gal'
  });
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { dataPoints, sensorName, sensorUnit } =
          await getSensorData(sensorId);
        setSensorData(dataPoints);
        setSensorMeta({ name: sensorName, unit: sensorUnit });

        setIsSummarizing(true);
        const analysisPrompt = `Analisis data sensor dalam Bahasa Indonesia. Jelaskan: 
        1. Nilai minimum, maksimum, dan rata-rata
        2. Pola atau tren yang terlihat
        3. Anomali jika ada
        Gunakan kalimat yang mudah dipahami teknisi lapangan.`;

        const result = await getSensorSummary(dataPoints, analysisPrompt);
        setSummary(result);
      } catch (err) {
        setError('Gagal memuat analisis data');
      } finally {
        setIsSummarizing(false);
      }
    };
    fetchData();
  }, [sensorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sensorMeta.name}</CardTitle>
        <CardDescription>Measured in {sensorMeta.unit}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={sensorData}
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
              {sensorMeta.name} data <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              {sensorData[0]?.time} - {sensorData[sensorData.length - 1]?.time}
            </div>
          </div>
        </div>

        <div className='mt-4 border-t pt-4'>
          <h3 className='mb-2 font-medium'>Analisis Data Sensor</h3>
          {isSummarizing ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-4/5' />
              <Skeleton className='h-4 w-3/5' />
            </div>
          ) : error ? (
            <p className='text-sm text-red-500'>{error}</p>
          ) : (
            <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
              {summary || 'Tidak ada analisis tersedia'}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
