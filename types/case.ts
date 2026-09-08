export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

export type Case = {
  id: string;
  title: string;
  patientAge: number | null;
  patientGender: string | null;
  status: CaseStatus;
  createdAt: string;
};