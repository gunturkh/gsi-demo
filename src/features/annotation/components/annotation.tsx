'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SensorData {
  id_sensor: number;
  nama_sensor: string;
  satuan: string;
  time: string;
  value: number;
}

const labelTypes = [
  { id: 'skip', label: 'Skip', color: 'bg-gray-200' },
  { id: 'normal', label: 'Normal', color: 'bg-green-500' },
  { id: 'missing', label: 'Missing', color: 'bg-red-500' },
  { id: 'minor', label: 'Minor', color: 'bg-blue-400' },
  { id: 'outlier', label: 'Outlier', color: 'bg-orange-500' },
  { id: 'square', label: 'Square', color: 'bg-pink-500' },
  { id: 'trend', label: 'Trend', color: 'bg-indigo-600' },
  { id: 'drift', label: 'Drift', color: 'bg-purple-500' }
];

const Annotation = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<{
    id: number;
    name: string;
    unit: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomSensorData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sensor-data');
      const data: SensorData[] = await response.json();

      // Select a random sensor
      const uniqueSensors = Array.from(
        new Set(data.map((item) => item.id_sensor))
      ).map((id) => {
        const sensorData = data.find((item) => item.id_sensor === id)!;
        return {
          id: sensorData.id_sensor,
          name: sensorData.nama_sensor,
          unit: sensorData.satuan
        };
      });

      const randomSensor =
        uniqueSensors[Math.floor(Math.random() * uniqueSensors.length)];
      setSelectedSensor(randomSensor);

      // Filter data for selected sensor and get 1 hour of data
      const sensorData = data
        .filter((item) => item.id_sensor === randomSensor.id)
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );

      // Get first hour of data
      const startTime = new Date(sensorData[0].time);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      const hourData = sensorData.filter((item) => {
        const itemTime = new Date(item.time);
        return itemTime >= startTime && itemTime <= endTime;
      });

      setSensorData(hourData);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomSensorData();
  }, [fetchRandomSensorData]);

  const handleLabel = async (labelType: string) => {
    // Log current data annotation
    console.log('Label selected:', labelType);
    console.log('Sensor:', selectedSensor?.name);
    console.log('Time range:', {
      start: sensorData[0]?.time,
      end: sensorData[sensorData.length - 1]?.time
    });
    console.log('Data points:', sensorData.length);

    // Fetch new random data
    await fetchRandomSensorData();
  };

  return (
    <div className='w-full space-y-4 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Data Annotation</CardTitle>
          {selectedSensor && (
            <CardDescription>
              {selectedSensor.name} ({selectedSensor.unit})
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className='mb-6 h-[400px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='time'
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  }}
                />
                <YAxis
                  label={{
                    value: selectedSensor?.unit,
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                  }}
                  formatter={(value: number) => [value.toFixed(6), 'Value']}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='hsl(var(--primary))'
                  strokeWidth={3}
                  dot={false}
                  fill='none'
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='grid grid-cols-4 gap-2 sm:grid-cols-8'>
            {labelTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => handleLabel(type.id)}
                disabled={isLoading}
                className={`${type.color} flex h-20 flex-col items-center justify-center text-white ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span className='text-xs'>{type.label}</span>
                {isLoading && <span className='animate-pulse'>Loading...</span>}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Annotation;
