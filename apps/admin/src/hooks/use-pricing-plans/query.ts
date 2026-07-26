export const pricingPlansQueryKey = {
  all: () => ["pricing-plans"] as const,
  list: () => [...pricingPlansQueryKey.all(), "list"] as const,
};
