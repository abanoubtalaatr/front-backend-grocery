import { KingsCrownIcon } from "@/components/ui/FormIcons";
import { Progress } from "@/components/ui/Progress";
import type { Membership as MembershipData } from '../types';

export default function Membership({ membership }: { membership?: MembershipData }) {
  if (!membership) {
    return null;
  }

  return (
    <div className="items-center gap-2 rounded-lg border border-black/20 p-4 bg-[#F7FCFF]">
      <div className="flex items-center gap-2">
        <KingsCrownIcon className="h-6 w-6" />
        <h6>Membership Tier: {membership.current_tier.name}</h6>
      </div>

      <div className="my-10">
        <Progress
          label={membership.progress_label}
          current={membership.points_current}
          max={membership.points_max}
          unit="pts"
        />
      </div>

      <div className="flex flex-row gap-2 p-10">
        {membership.tiers.map((tier) => (
          <div
            key={tier.key}
            className="flex w-1/4 flex-col rounded-lg border border-black/20 p-4 text-center"
          >
            <h6>{tier.name}</h6>
            <p>{tier.min_points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
