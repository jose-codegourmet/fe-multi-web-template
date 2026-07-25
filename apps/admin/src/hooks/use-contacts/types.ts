export type ContactStatus = "UNREAD" | "READ" | "RESOLVED";

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
};
