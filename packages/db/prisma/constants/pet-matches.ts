import { MatchStatus } from "@prisma/client";

import { SEED_PET_IDS } from "./pets";

export const seedPetMatches = [
  {
    id: "seed-pet-match-mochi-luna",
    requesterId: SEED_PET_IDS.mochi,
    receiverId: SEED_PET_IDS.luna,
    status: MatchStatus.PENDING,
  },
  {
    id: "seed-pet-match-atlas-benny",
    requesterId: SEED_PET_IDS.atlas,
    receiverId: SEED_PET_IDS.benny,
    status: MatchStatus.ACCEPTED,
  },
  {
    id: "seed-pet-match-pepper-luna",
    requesterId: SEED_PET_IDS.pepper,
    receiverId: SEED_PET_IDS.luna,
    status: MatchStatus.REJECTED,
  },
] as const;
