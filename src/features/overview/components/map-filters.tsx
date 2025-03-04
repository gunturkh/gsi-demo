'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterButtonProps {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  className?: string;
}

function FilterButton({
  active,
  count,
  label,
  onClick,
  className
}: FilterButtonProps) {
  return (
    <Button
      onClick={onClick}
      size='sm'
      variant={active ? 'default' : 'outline'}
      className={className}
    >
      {label}
      <Badge className='ml-2'>{count}</Badge>
    </Button>
  );
}

interface MapFiltersProps {
  totalLocations: number;
  criticalCount: number;
  warningCount: number;
  onFilterChange: (filter: 'all' | 'critical' | 'warning') => void;
  onSearch: (search: string) => void;
  activeFilter: 'all' | 'critical' | 'warning';
}

export default function MapFilters({
  totalLocations,
  criticalCount,
  warningCount,
  onFilterChange,
  onSearch,
  activeFilter
}: MapFiltersProps) {
  return (
    <div className='w-full border-b bg-white p-4'>
      <div className='flex items-center gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Search locations...'
            onChange={(e) => onSearch(e.target.value)}
            className='max-w-sm'
          />
        </div>

        <div className='flex items-center gap-2'>
          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => onFilterChange('all')}
            count={totalLocations}
            label='All Locations'
          />

          <FilterButton
            active={activeFilter === 'critical'}
            onClick={() => onFilterChange('critical')}
            count={criticalCount}
            label='Critical'
            className='text-red-500'
          />

          <FilterButton
            active={activeFilter === 'warning'}
            onClick={() => onFilterChange('warning')}
            count={warningCount}
            label='Warnings'
            className='text-yellow-500'
          />
        </div>
      </div>
    </div>
  );
}
