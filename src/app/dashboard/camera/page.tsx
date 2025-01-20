import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import CameraView from '@/features/camera/components/camera-view';
import React from 'react';

const DetailPage = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Camera'
            description='Monitor and manage camera settings, streams, and recordings'
          />
        </div>
        <Separator />
        <CameraView />
      </div>
    </PageContainer>
  );
};

export default DetailPage;
