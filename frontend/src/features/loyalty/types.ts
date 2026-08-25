export interface PointBalance {
  point_balance: number;
  point_value: number;
  profile_initial: string;
  rewards_currency: string;
  rewards_value: number;
}

export interface Tier {
  key: string;
  name: string;
  min_points: number;
  is_current: boolean;
  is_unlocked: boolean;
}

export interface MembershipTierDetails {
  key: string;
  name: string;
  min_points: number;
}

export interface Membership {
  current_tier: MembershipTierDetails;
  next_tier: MembershipTierDetails | null;
  progress_label: string;
  points_current: number;
  points_max: number;
  points_to_next: number;
  tiers: Tier[];
}

export interface BenefitItem {
  title: string;
  description: string;
}

export interface Benefits {
  tier_key: string;
  tier_name: string;
  items: BenefitItem[];
}

export interface LoyaltyCoupon {
  id: number;
  title: string;
  code: string;
  description: string | null;
  type: string;
  discount_label: string;
  minimum_purchase: number | null;
  expires_at: string | null;
  expires_label: string | null;
  is_featured?: boolean;
}

export interface Loyalty {
  point_balance: number;
  rewards_value: number;
  rewards_currency: string;
  point_value: number;
  profile_initial: string;
  membership: Membership;
  benefits: Benefits;
  coupons: LoyaltyCoupon[];
}