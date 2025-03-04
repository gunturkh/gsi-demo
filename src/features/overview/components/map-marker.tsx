'use client';
import { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-map-gl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SensorLocation {
  id: string;
  name: string;
  coordinates: number[];
  sensors: {
    total: number;
    operational: number;
    warning: number;
    critical: number;
  };
  criticalAlerts?: string[];
}

interface MapMarkerProps {
  location: SensorLocation;
}

export default function MapMarker({ location }: MapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 100); // Small delay to allow mouse to move to popup
  };

  // Calculate status for marker color
  const getMarkerColor = () => {
    const operationalPercentage =
      (location.sensors.operational / location.sensors.total) * 100;
    if (location.sensors.critical > 0) return '#ef4444'; // red
    if (location.sensors.warning > 0) return '#f59e0b'; // yellow
    if (operationalPercentage > 90) return '#22c55e'; // green
    return '#f59e0b'; // yellow as default for other cases
  };

  // Calculate marker size based on sensor count (between 36 and 48)
  const getMarkerSize = () => {
    const minSize = 36;
    const maxSize = 48;
    const maxSensors = 50; // Adjust based on your max expected sensors
    const size =
      minSize + (location.sensors.total / maxSensors) * (maxSize - minSize);
    return Math.min(Math.max(size, minSize), maxSize);
  };

  const markerSize = getMarkerSize();

  return (
    <div ref={containerRef}>
      <Marker
        longitude={location.coordinates[0]}
        latitude={location.coordinates[1]}
      >
        <div
          className='relative cursor-pointer'
          onClick={() =>
            router.push(`/sites/${location.name.replace(/\s+/g, '-')}`)
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role='button'
          aria-label={`${location.name} - ${location.sensors.total} sensors`}
        >
          {/* Pulse Animation for Critical Status */}
          {location.sensors.critical > 0 && (
            <div
              className='absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75'
              style={{ width: markerSize, height: markerSize }}
            />
          )}

          {/* Main Marker */}
          <div className='relative transform transition-transform duration-200 hover:scale-110'>
            <svg
              width={markerSize}
              height={markerSize}
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              style={{
                color: getMarkerColor(),
                filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'
              }}
              className='transition-colors duration-200'
            >
              <path
                d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'
                fill='currentColor'
              />
            </svg>

            {/* Sensor Count */}
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-xs font-bold text-white'>
              {location.sensors.total}
            </div>
          </div>

          {/* Status Indicator */}
          {location.sensors.critical > 0 && (
            <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full border border-white bg-red-500 shadow-sm' />
          )}
        </div>
      </Marker>

      <AnimatePresence>
        {showPopup && (
          <Popup
            longitude={location.coordinates[0]}
            latitude={location.coordinates[1]}
            anchor='bottom'
            closeButton={false}
            closeOnClick={false}
            className='!bg-transparent !p-0'
            maxWidth='320px'
          >
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className='border bg-white/95 shadow-lg backdrop-blur-sm'>
                  <CardHeader className='p-3 pb-2'>
                    <CardTitle className='flex items-center justify-between text-lg'>
                      {location.name}
                      <span className='text-sm font-normal text-muted-foreground'>
                        {location.sensors.operational} /{' '}
                        {location.sensors.total} online
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-3 pt-0'>
                    {/* Status Bars */}
                    <div className='space-y-2'>
                      <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span>Operational</span>
                          <span className='text-green-600'>
                            {location.sensors.operational}
                          </span>
                        </div>
                        <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                          <div
                            className='h-full rounded-full bg-green-500 transition-all duration-500'
                            style={{
                              width: `${(location.sensors.operational / location.sensors.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span>Warning</span>
                          <span className='text-yellow-500'>
                            {location.sensors.warning}
                          </span>
                        </div>
                        <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                          <div
                            className='h-full rounded-full bg-yellow-500 transition-all duration-500'
                            style={{
                              width: `${(location.sensors.warning / location.sensors.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>

                      <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                          <span>Critical</span>
                          <span className='text-red-500'>
                            {location.sensors.critical}
                          </span>
                        </div>
                        <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                          <div
                            className='h-full rounded-full bg-red-500 transition-all duration-500'
                            style={{
                              width: `${(location.sensors.critical / location.sensors.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Critical Alerts */}
                    {location.criticalAlerts &&
                      location.criticalAlerts.length > 0 && (
                        <div className='mt-3 border-t pt-3'>
                          <div className='mb-1 text-sm font-semibold text-red-500'>
                            Critical Alerts:
                          </div>
                          <ul className='space-y-1'>
                            {location.criticalAlerts.map((alert, index) => (
                              <li
                                key={index}
                                className='flex items-start gap-2 text-xs text-gray-600'
                              >
                                <span className='mt-0.5 text-red-500'>⚠</span>
                                {alert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Action Button */}
                    <Button
                      className='mt-3 w-full'
                      onClick={() =>
                        router.push(
                          `/sites/${location.name.replace(/\s+/g, '-')}`
                        )
                      }
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </div>
  );
}
