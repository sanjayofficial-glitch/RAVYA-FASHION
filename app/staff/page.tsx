import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StaffDashboard } from '@/components/staff/StaffDashboard';

export const metadata: Metadata = {
  title: 'Staff Inventory',
  alternates: { canonical: '/staff' },
  description: 'In-store inventory dashboard for Ravya Fashion staff.',
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return (
    <Suspense>
      <StaffDashboard />
    </Suspense>
  );
}
