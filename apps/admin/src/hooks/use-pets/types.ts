export type PetRow = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  photoUrl: string | null;
  ownerName: string | null;
  ownerEmail: string;
  createdAt: string;
};
