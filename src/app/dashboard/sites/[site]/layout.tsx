import PageContainer from '@/components/layout/page-container';
import React from 'react';

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>{children}</div>
    </PageContainer>
  );
};

export default SiteLayout;
