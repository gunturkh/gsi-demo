import PageContainer from '@/components/layout/page-container';
import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}

export default Layout;
