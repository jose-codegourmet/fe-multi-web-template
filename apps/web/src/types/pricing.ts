export type PricingPlan = {
  id: string;
  name: string;
  nickname: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  ctaLabel: string;
  featured: boolean;
};
