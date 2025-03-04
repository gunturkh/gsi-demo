'use client';
import Map, { Source, Layer, LayerProps, Popup } from 'react-map-gl';
import MapMarker from './map-marker';
import MapLegend from './map-legend';
import MapFilters from './map-filters';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CSSProperties } from 'react';

// Add this console log temporarily to debug
console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

// Sample data - you would replace this with real data
const LOCATION_DATA = [
  {
    id: '1',
    name: 'Surabaya',
    coordinates: [112.699, -7.198],
    sensors: {
      total: 15,
      operational: 12,
      warning: 2,
      critical: 1
    },
    criticalAlerts: [
      'Vibration sensor S-123 offline',
      'High strain detected on beam B-45'
    ]
  },
  {
    id: '2',
    name: 'Palembang',
    coordinates: [104.757, -2.991],
    sensors: {
      total: 12,
      operational: 11,
      warning: 1,
      critical: 0
    }
  },
  {
    id: '3',
    name: 'Batam',
    coordinates: [104.041, 0.981],
    sensors: {
      total: 20,
      operational: 20,
      warning: 0,
      critical: 0
    }
  }
];

// Define the layer types
const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#3b82f6',
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  },
  paint: {
    'text-color': '#ffffff'
  }
};

const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'status'],
      'critical',
      '#ef4444',
      'warning',
      '#f59e0b',
      '#22c55e' // default color for operational
    ],
    'circle-radius': 15,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff'
  }
};

const unclusteredPointCountLayer: LayerProps = {
  id: 'unclustered-point-count',
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'text-field': '{sensorCount}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  },
  paint: {
    'text-color': '#ffffff'
  }
};

// Define the popup style type
const popupStyle: { [key: string]: CSSProperties } = {
  '.mapboxgl-popup-content': {
    background: 'none',
    border: 'none',
    padding: 0,
    boxShadow: 'none'
  },
  '.mapboxgl-popup-tip': {
    display: 'none'
  }
};

export default function MapOverview() {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'critical' | 'warning'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredPointInfo, setHoveredPointInfo] = useState<any>(null);
  const [clickedPointInfo, setClickedPointInfo] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const router = useRouter();

  const filteredLocations = useMemo(() => {
    return LOCATION_DATA.filter((location) => {
      const matchesSearch = location.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'critical' && location.sensors.critical > 0) ||
        (activeFilter === 'warning' && location.sensors.warning > 0);
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchTerm]);

  const counts = useMemo(
    () => ({
      total: LOCATION_DATA.length,
      critical: LOCATION_DATA.filter((l) => l.sensors.critical > 0).length,
      warning: LOCATION_DATA.filter((l) => l.sensors.warning > 0).length
    }),
    []
  );

  // Convert your locations to GeoJSON
  const locationGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: filteredLocations.map((location) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.coordinates[0], location.coordinates[1]]
        },
        properties: {
          id: location.id,
          name: location.name,
          sensorCount: location.sensors.total.toString(),
          status:
            location.sensors.critical > 0
              ? 'critical'
              : location.sensors.warning > 0
                ? 'warning'
                : 'operational',
          ...location.sensors
        }
      }))
    }),
    [filteredLocations]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Add global mouse move handler
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!hoveredPointInfo) return;

      // Check if mouse is over popup or map
      const popupElement = popupRef.current;
      const mapElement = mapRef.current?.getMap()?.getCanvas();

      if (!popupElement || !mapElement) return;

      const isOverPopup =
        e.target instanceof Node && popupElement.contains(e.target as Node);
      const isOverMap =
        e.target instanceof Node && mapElement.contains(e.target as Node);

      if (!isOverPopup && !isOverMap) {
        setHoveredPointInfo(null);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () =>
      document.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [hoveredPointInfo]);

  const handleMouseEnter = (event: any) => {
    const feature = event.features?.[0];
    if (feature && !feature.properties.cluster) {
      setHoveredPointInfo({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        ...feature.properties
      });
    }
  };

  const handleMouseLeave = (event: any) => {
    // Only close if we're not moving to the popup
    const toElement = event.relatedTarget;
    const popupElement = popupRef.current;
    if (popupElement && !popupElement.contains(toElement)) {
      setHoveredPointInfo(null);
    }
  };

  const handleClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature && !feature.properties.cluster) {
      router.push(
        `/dashboard/sites/${feature.properties.name.replace(/\s+/g, '-')}`
      );
    }
  };

  return (
    <div className='relative h-full w-full'>
      <MapFilters
        totalLocations={counts.total}
        criticalCount={counts.critical}
        warningCount={counts.warning}
        onFilterChange={setActiveFilter}
        onSearch={setSearchTerm}
        activeFilter={activeFilter}
      />
      <div className='relative h-[500px] w-full'>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: 118,
            latitude: -2.5,
            zoom: 5
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/mapbox/streets-v9'
          interactiveLayerIds={['clusters', 'unclustered-point']}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Source
            id='locations'
            type='geojson'
            data={locationGeoJson}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
            <Layer {...unclusteredPointCountLayer} />
          </Source>

          <AnimatePresence>
            {hoveredPointInfo && (
              <Popup
                longitude={hoveredPointInfo.longitude}
                latitude={hoveredPointInfo.latitude}
                anchor='bottom'
                closeButton={false}
                closeOnClick={false}
                maxWidth='320px'
                className='!p-0'
                style={popupStyle}
              >
                <div
                  ref={popupRef}
                  onMouseEnter={() => setHoveredPointInfo(hoveredPointInfo)}
                  onMouseLeave={() => setHoveredPointInfo(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className='w-52 border bg-white/95 shadow-lg backdrop-blur-sm'>
                      <CardHeader className='p-3 pb-2'>
                        <CardTitle className='flex items-center justify-between text-lg'>
                          {hoveredPointInfo.name}
                          <span className='text-sm font-normal text-muted-foreground'>
                            {hoveredPointInfo.operational} /{' '}
                            {hoveredPointInfo.total} online
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-3 pt-0'>
                        <div className='space-y-2'>
                          <div className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span>Operational</span>
                              <span className='text-green-600'>
                                {hoveredPointInfo.operational}
                              </span>
                            </div>
                            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                              <div
                                className='h-full rounded-full bg-green-500 transition-all duration-500'
                                style={{
                                  width: `${(hoveredPointInfo.operational / hoveredPointInfo.total) * 100}%`
                                }}
                              />
                            </div>
                          </div>

                          <div className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span>Warning</span>
                              <span className='text-yellow-500'>
                                {hoveredPointInfo.warning}
                              </span>
                            </div>
                            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                              <div
                                className='h-full rounded-full bg-yellow-500 transition-all duration-500'
                                style={{
                                  width: `${(hoveredPointInfo.warning / hoveredPointInfo.total) * 100}%`
                                }}
                              />
                            </div>
                          </div>

                          <div className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span>Critical</span>
                              <span className='text-red-500'>
                                {hoveredPointInfo.critical}
                              </span>
                            </div>
                            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                              <div
                                className='h-full rounded-full bg-red-500 transition-all duration-500'
                                style={{
                                  width: `${(hoveredPointInfo.critical / hoveredPointInfo.total) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {hoveredPointInfo.criticalAlerts &&
                          hoveredPointInfo.criticalAlerts.length > 0 && (
                            <div className='mt-3 border-t pt-3'>
                              <div className='mb-1 text-sm font-semibold text-red-500'>
                                Critical Alerts:
                              </div>
                              <ul className='space-y-1'>
                                {hoveredPointInfo.criticalAlerts.map(
                                  (alert: string, index: number) => (
                                    <li
                                      key={index}
                                      className='flex items-start gap-2 text-xs text-gray-600'
                                    >
                                      <span className='mt-0.5 text-red-500'>
                                        ⚠
                                      </span>
                                      {alert}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        <Button
                          className='mt-3 w-full'
                          onClick={() =>
                            router.push(
                              `/dashboard/sites/${hoveredPointInfo.name.replace(/\s+/g, '-')}`
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

          <MapLegend />
        </Map>
      </div>
    </div>
  );
}
