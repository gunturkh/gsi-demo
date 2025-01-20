'use client';
import React from 'react';
import Webcam from 'react-webcam';

const CameraView = () => {
  // const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState<MediaDeviceInfo[] | []>([]);

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      console.log('mediaDevices', mediaDevices);
      setDevices(
        mediaDevices.filter(
          ({ kind, label }) => kind === 'videoinput' && !label.includes('OBS')
        )
      );
    },

    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <div className='grid grid-cols-4 gap-2'>
      {devices.map((device, key) => (
        <div>
          <div className='flex flex-col'>
            {/* @ts-ignore */}
            <Webcam
              audio={false}
              height={360}
              videoConstraints={{ deviceId: device.deviceId }}
            />
            {device.label || `Device ${key + 1}`}
          </div>
        </div>
      ))}
    </div>
  );
};
export default CameraView;
