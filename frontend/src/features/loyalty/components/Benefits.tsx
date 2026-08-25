import { StarIcon } from '@/components/ui/FormIcons';
import type { Benefits as BenefitsType } from '../types';

export default function Benefits({ benefits }: { benefits?: BenefitsType }) {
  if (!benefits?.items?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
      <h6 className="my-4 text-lg font-bold">Your {benefits.tier_name} Benefits</h6>
      <div className="flex flex-row flex-wrap gap-4">
        {benefits.items.map((item) => (
          <div
            key={item.title}
            className="flex flex-1 min-w-[200px] flex-col gap-4 rounded-lg border border-black/20 bg-[#DAD8D8] p-4"
          >
            <div className="flex flex-row gap-2">
              <StarIcon className="size-6" />
              <h6>{item.title}</h6>
            </div>
            <p className="pl-6 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
