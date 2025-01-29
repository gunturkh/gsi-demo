import SiteDetailView from '@/features/sites/components/site-detail-view';

export default function SiteDetailPage({
  params
}: {
  params: { site: string };
}) {
  return <SiteDetailView site={params.site} />;
}
