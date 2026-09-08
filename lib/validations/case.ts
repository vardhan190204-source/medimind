import { z } from "zod";

export const createCaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Case title is required"),

  patientAge: z
    .number()
    .int()
    .min(0)
    .max(150)
    .nullable(),

  patientGender: z
    .string()
    .trim()
    .max(50)
    .nullable(),

  symptoms: z
    .string()
    .trim()
    .max(10000)
    .nullable(),

  clinicalNotes: z
    .string()
    .trim()
    .max(20000)
    .nullable(),
});

export const documentSchema = z.object({
  type: z.enum([
    "LAB_REPORT",
    "XRAY",
    "CT",
    "MRI",
    "NOTES",
    "OTHER",
  ]),

  fileUrl: z.string().url(),

  fileName: z
    .string()
    .min(1),

  mimeType: z
    .string()
    .min(1),

  extractedText: z
    .string()
    .nullable(),
});

export const documentsSchema =
  z.array(documentSchema);

export type CreateCaseInput =
  z.infer<typeof createCaseSchema>;

export type DocumentInput =
  z.infer<typeof documentSchema>;