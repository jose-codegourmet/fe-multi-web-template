import { ContactStatus } from "@prisma/client";

export const seedContacts = [
  {
    id: "seed-contact-unread-playdate",
    name: "Sam Ortega",
    email: "sam.ortega@example.com",
    subject: "Playdate availability in Makati",
    message:
      "We just moved nearby and would like a calm weekend playdate for our senior beagle. Is the matching queue still open for small dogs?",
    status: ContactStatus.UNREAD,
  },
  {
    id: "seed-contact-read-safety",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    subject: "Safety check before a first meetup",
    message:
      "Could you confirm the recommended public meetup spots and what ID checks you run before two households meet?",
    status: ContactStatus.READ,
  },
  {
    id: "seed-contact-resolved-billing",
    name: "Chris Delgado",
    email: "chris.delgado@example.com",
    subject: "Plus plan invoice copy",
    message:
      "Please send a copy of last month's Plus invoice so I can expense the community membership. Resolved via email on the demo inbox.",
    status: ContactStatus.RESOLVED,
  },
] as const;
