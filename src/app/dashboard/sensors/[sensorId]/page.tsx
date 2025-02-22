import { delay } from '@/constants/mock-api';
import { SensorAreaChart } from '@/features/sensors/components/sensor-area-chart';

export default async function SensorPage({
  params
}: {
  params: { sensorId: string };
}) {
  const { sensorId } = await params;
  await delay(2000);
  return <SensorAreaChart sensorId={sensorId} />;
}
