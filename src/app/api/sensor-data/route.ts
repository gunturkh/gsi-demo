import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sensorId = searchParams.get('id_sensor');

    // Path to your JSON file
    const dataPath = path.join(
      process.cwd(),
      'src/mock/filtered_data_per_minute.json'
    );

    // Read and parse the JSON file
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const sensorData = JSON.parse(jsonData);

    // Add filtering logic
    const filteredData = sensorId
      ? sensorData.filter((item: any) => item.id_sensor === Number(sensorId))
      : sensorData;

    return NextResponse.json(filteredData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load sensor data' },
      { status: 500 }
    );
  }
}
