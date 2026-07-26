export type PricingPlanRow = {
  id: string;
  name: string;
  nickname: string | null;
  price: number;
  interval: string;
  description: string | null;
  features: string[];
  ctaLabel: string | null;
  featured: boolean;
  active: boolean;
  createdAt: string;
};
