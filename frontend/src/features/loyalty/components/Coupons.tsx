import type { LoyaltyCoupon } from '../types';

export default function Coupons({ coupons }: { coupons?: LoyaltyCoupon[] }) {
  if (!coupons?.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
      <h6 className="my-4 text-lg font-bold">Your Coupons</h6>
      {coupons.map((coupon) => (
        <div
          key={coupon.id}
          className="flex flex-row items-center gap-4 rounded-lg border border-black/20 bg-[#DAD8D8] p-4"
        >
          <div className="rounded-lg border border-black/20 bg-amber-50 p-4">
            {coupon.title.charAt(0)}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-2">
            <p className="text-lg font-bold">{coupon.discount_label}</p>
            <h6 className="text-sm">Code: {coupon.code}</h6>
            {coupon.description ? <p>{coupon.description}</p> : null}
            <p className="text-sm">
              {coupon.minimum_purchase != null
                ? `Min. order £${coupon.minimum_purchase}`
                : null}
              {coupon.expires_label ? ` • Expires: ${coupon.expires_label}` : null}
            </p>
          </div>
          <div>
            <button
              type="button"
              className="rounded-lg bg-grocery-900 p-2 text-white"
              onClick={() => navigator.clipboard?.writeText(coupon.code)}
            >
              Apply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
