'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface SensorData {
  id_sensor: number;
  nama_sensor: string;
  satuan: string;
  time: string;
  value: number;
}

interface GroupedSensorData {
  [key: number]: {
    name: string;
    unit: string;
    data: SensorData[];
  };
}

const Dataset = () => {
  const [sensorData, setSensorData] = useState<GroupedSensorData>({});
  const [selectedHour, setSelectedHour] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data');
        const data: SensorData[] = await response.json();
        console.log('Fetched data:', data);

        // Group data by sensor ID
        const grouped = data.reduce((acc: GroupedSensorData, item) => {
          if (!acc[item.id_sensor]) {
            acc[item.id_sensor] = {
              name: item.nama_sensor,
              unit: item.satuan,
              data: []
            };
          }
          acc[item.id_sensor].data.push(item);
          return acc;
        }, {});

        setSensorData(grouped);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected hour
  const filterDataByHour = (data: SensorData[], hour: number) => {
    return data.filter((item) => {
      const itemHour = new Date(item.time).getHours();
      return itemHour >= hour && itemHour < hour + 1;
    });
  };

  return (
    <div className='w-full space-y-4 p-4'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Select Hour:
          <input
            type='range'
            min='0'
            max='23'
            value={selectedHour}
            onChange={(e) => setSelectedHour(Number(e.target.value))}
            className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
          />
          <span className='ml-2'>
            {selectedHour}:00 - {selectedHour + 1}:00
          </span>
        </label>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        {/* Individual charts for each sensor */}
        {Object.entries(sensorData).map(([sensorId, sensorInfo]) => {
          const filteredData = filterDataByHour(sensorInfo.data, selectedHour);
          const latestValue =
            sensorInfo.data[sensorInfo.data.length - 1]?.value || 0;

          return (
            <Card key={sensorId}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>{sensorInfo.name}</CardTitle>
                    <CardDescription>Unit: {sensorInfo.unit}</CardDescription>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold'>
                      {latestValue.toFixed(2)}
                    </div>
                    <div className='text-sm text-gray-500'>Latest Value</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={filteredData}>
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
                          value: sensorInfo.unit,
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
                        formatter={(value: number) => [
                          value.toFixed(2),
                          'Value'
                        ]}
                      />
                      <Line
                        type='monotone'
                        dataKey='value'
                        stroke={`hsl(${Number(sensorId) * 137.5}, 70%, 50%)`}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dataset;
