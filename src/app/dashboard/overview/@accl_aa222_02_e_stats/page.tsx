import { delay } from '@/constants/mock-api';
import { SensorAreaGraph } from '@/features/overview/components/sensor-area-graph';

export default async function AreaStats() {
  await await delay(2000);
  return <SensorAreaGraph sensorId='64' />;
}
