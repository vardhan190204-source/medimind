import { z } from "zod";

export const analysisSchema = z.object({
  summary: z.string(),

  differentialDx: z.array(
    z.object({
      diagnosis: z.string(),

      likelihood: z.enum([
        "high",
        "moderate",
        "low",
      ]),

      reasoning: z.string(),

      supportingEvidence: z.array(
        z.string()
      ),

      contradictoryEvidence: z.array(
        z.string()
      ),
    })
  ),

  redFlags: z.array(
    z.string()
  ),

  recommendations: z.object({
    immediateActions: z.array(
      z.string()
    ),

    investigations: z.array(
      z.string()
    ),

    clinicalConsiderations: z.array(
      z.string()
    ),

    followUp: z.array(
      z.string()
    ),
  }),
});

export type AnalysisResult =
  z.infer<typeof analysisSchema>;