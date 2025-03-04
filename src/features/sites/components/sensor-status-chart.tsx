'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SensorStatus {
  status: string;
  count: number;
  color: string;
}

const sensorData: SensorStatus[] = [
  { status: 'Online', count: 75, color: '#22c55e' },
  { status: 'Offline', count: 15, color: '#ef4444' },
  { status: 'In Progress', count: 10, color: '#f59e0b' }
];

export default function SensorStatusChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create pie generator
    const pie = d3.pie<SensorStatus>().value((d) => d.count);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<SensorStatus>>()
      .innerRadius(0)
      .outerRadius(radius - 20);

    // Generate pie chart
    const arcs = svg
      .selectAll('arc')
      .data(pie(sensorData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add paths
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .text((d) => `${d.data.count}`);
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <svg ref={svgRef}></svg>
      <div className='mt-4 flex gap-4'>
        {sensorData.map((data) => (
          <div key={data.status} className='flex items-center gap-2'>
            <div
              className='h-3 w-3 rounded-full'
              style={{ backgroundColor: data.color }}
            ></div>
            <span className='text-sm'>{data.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
