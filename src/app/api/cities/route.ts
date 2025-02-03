import { NextResponse } from 'next/server';

export async function GET() {
  const cities = [
    {
      name: 'Jakarta',
      longitude: 106.8456,
      latitude: -6.2088,
      data: {
        bridges: [
          { name: 'Suramadu Bridge', longitude: 112.699, latitude: -7.198 }
        ]
      }
    },
    { name: 'Surabaya', longitude: 112.752, latitude: -7.2575 },
    {
      name: 'Batam',
      longitude: 104.03,
      latitude: 1.15,
      data: {
        bridges: [
          { name: 'Barelang Bridge', longitude: 104.083, latitude: 0.933 }
        ]
      }
    }
  ];

  return NextResponse.json(cities, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
