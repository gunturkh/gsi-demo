'use client';

export default function MapLegend() {
  return (
    <div className='absolute bottom-4 right-4 max-w-[200px] rounded-lg border bg-white/95 p-4 shadow-lg backdrop-blur-sm'>
      <h3 className='mb-3 font-semibold'>Location Status</h3>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 rounded-full bg-green-500' />
          <span className='text-sm'>{'Operational (>90%)'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 rounded-full bg-yellow-500' />
          <span className='text-sm'>Warning Present</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 rounded-full bg-red-500' />
          <span className='text-sm'>Critical Issues</span>
        </div>
        <div className='mt-2 flex items-center gap-2 border-t pt-2'>
          <div className='h-4 w-4 rounded-full bg-blue-500' />
          <span className='text-sm'>Clustered Locations</span>
        </div>
      </div>
    </div>
  );
}
