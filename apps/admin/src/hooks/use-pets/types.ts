export type PetRow = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  bio: string | null;
  photoUrl: string | null;
  ownerId: string;
  ownerName: string | null;
  ownerEmail: string;
  createdAt: string;
};
