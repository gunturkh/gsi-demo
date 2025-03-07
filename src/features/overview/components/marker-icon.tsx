import React from 'react';

export function MarkerIcon({ color = '#3b82f6' }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'
        fill={color}
        stroke='none'
      />
    </svg>
  );
}
