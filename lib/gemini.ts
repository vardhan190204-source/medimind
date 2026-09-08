import { GoogleGenAI, Type } from "@google/genai";

import { analysisSchema } from "@/lib/validations/analysis";

const GEMINI_MODEL = "gemini-2.5-flash";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const responseSchema = {
  type: Type.OBJECT,

  properties: {
    summary: {
      type: Type.STRING,
    },

    differentialDx: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          diagnosis: {
            type: Type.STRING,
          },

          likelihood: {
            type: Type.STRING,
            enum: ["high", "moderate", "low"],
          },

          reasoning: {
            type: Type.STRING,
          },

          supportingEvidence: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          contradictoryEvidence: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },

        required: [
          "diagnosis",
          "likelihood",
          "reasoning",
          "supportingEvidence",
          "contradictoryEvidence",
        ],
      },
    },

    redFlags: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },

    recommendations: {
      type: Type.OBJECT,

      properties: {
        immediateActions: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        investigations: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        clinicalConsiderations: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },

        followUp: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },

      required: [
        "immediateActions",
        "investigations",
        "clinicalConsiderations",
        "followUp",
      ],
    },
  },

  required: ["summary", "differentialDx", "redFlags", "recommendations"],
};

type AnalyseCaseInput = {
  title: string;
  patientAge: number | null;
  patientGender: string | null;
  symptoms: string | null;
  clinicalNotes: string | null;

  documents: {
    type: string;
    fileName: string;
    mimeType: string;
    extractedText: string | null;
    fileUrl: string;
  }[];
};

export async function analyseCase({
  title,
  patientAge,
  patientGender,
  symptoms,
  clinicalNotes,
  documents,
}: AnalyseCaseInput) {
  const documentText = documents
    .map(
      (document) => `
DOCUMENT TYPE: ${document.type}
FILE: ${document.fileName}

OCR / EXTRACTED TEXT:
${document.extractedText ?? "No OCR text available"}
`,
    )
    .join("\n\n");

  const prompt = `
You are a clinical decision-support assistant.

IMPORTANT:
You are assisting a qualified healthcare professional.
Do not present your output as a definitive diagnosis.
Do not invent findings that are not present in the supplied information.
Clearly distinguish observations, possibilities, uncertainty, and recommendations.

CASE INFORMATION

Title:
${title}

Patient age:
${patientAge ?? "Not provided"}

Patient gender:
${patientGender ?? "Not provided"}

Symptoms:
${symptoms ?? "Not provided"}

Clinical notes:
${clinicalNotes ?? "Not provided"}

DOCUMENTS AND OCR:

${documentText}

Analyze ALL supplied information together.

The output must contain:

1. A concise clinical summary.
2. Differential diagnoses with likelihood and reasoning.
3. Red flags explicitly supported by the supplied information.
4. Reasonable clinical considerations and possible investigations.
5. Follow-up considerations.

Do not assume missing information.
Do not fabricate laboratory values.
Do not fabricate imaging findings.
Do not claim certainty when the evidence does not support certainty.
`;

  const contents: any[] = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  for (const document of documents) {
    if (
      !document.mimeType.startsWith("image/") &&
      document.mimeType !== "application/pdf"
    ) {
      continue;
    }

    console.log("DOCUMENT URL:", document.fileUrl);

    try {
      const response = await fetch(document.fileUrl);

      console.log("DOCUMENT STATUS:", response.status);

      console.log(
        "DOCUMENT CONTENT TYPE:",
        response.headers.get("content-type"),
      );

      if (!response.ok) {
        console.error(`Failed to fetch document: ${document.fileName}`);

        continue;
      }

      const buffer = await response.arrayBuffer();

      contents[0].parts.push({
        inlineData: {
          mimeType: document.mimeType,
          data: Buffer.from(buffer).toString("base64"),
        },
      });
    } catch (error) {
      console.error(`Failed to process document: ${document.fileName}`, error);
    }
  }

  console.log("Sending case to Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const raw = response.text;

  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("Gemini returned invalid JSON:", raw);

    throw new Error("Gemini returned invalid JSON");
  }

  return analysisSchema.parse(parsed);
}
