export type PetProfile = {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string;
  age: number;
  size: "small" | "medium" | "large";
  energyLevel: "low" | "medium" | "high";
  playStyles: string[];
  distanceKm: number;
  compatibilityScore: number;
  image: string;
  bio: string;
  lookingFor: string[];
  verified: boolean;
};
