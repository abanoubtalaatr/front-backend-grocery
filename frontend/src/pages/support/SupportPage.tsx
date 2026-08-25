import { Cards, Questions, Report } from '@/features/support';
import { Suspense } from 'react';

export const SupportPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Cards />
      </Suspense>

      <Questions />
      <Report />
    </div>
  );
};
