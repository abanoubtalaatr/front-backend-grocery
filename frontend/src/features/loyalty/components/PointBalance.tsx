import { Button } from "@/components/ui/Button";

import type { PointBalance } from '../types';

export default function PointBalance({ pointBalance }: { pointBalance: PointBalance }) {
  console.log(pointBalance.point_value, 'pointBalance');
  return (
    <div className="flex flex-row gap-4 bg-[#014162] text-white  rounded-lg p-12">
      <div className="flex flex-col grow  gap-4">
        <h6 className="">Point Balance</h6>
        <h6>{pointBalance.point_balance} pts</h6>= £ {pointBalance.rewards_value} in rewards
        <Button variant="primary" className="w-50 bg-white text-black my-5"><span>Redeem Points</span></Button>
      </div>
      <div className="flex justify-center items-center"><div className="rounded-full bg-white text-black p-4">{pointBalance.profile_initial}</div></div>
    </div>
  );
}
