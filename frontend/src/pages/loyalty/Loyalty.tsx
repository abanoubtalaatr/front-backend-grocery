import { PointBalance, useLoyaltyManagement, Membership, Benefits, Coupons } from '@/features/loyalty';

export function Loyalty() {
  const { loyalty, isLoading } = useLoyaltyManagement();

  if (isLoading || !loyalty) {
    return <p className="text-grocery-600 text-sm">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-20">
      <PointBalance
        pointBalance={{
          point_balance: loyalty.point_balance,
          point_value: loyalty.point_value,
          profile_initial: loyalty.profile_initial,
          rewards_currency: loyalty.rewards_currency,
          rewards_value: loyalty.rewards_value,
        }}
      />
      <Membership membership={loyalty.membership} />
      <Benefits benefits={loyalty.benefits} />
      <Coupons coupons={loyalty.coupons} />
    </div>
  );
}
