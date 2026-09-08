import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

import {
  createCaseSchema,
  documentSchema,
} from "@/lib/validations/case";

import { analyseCase } from "@/lib/gemini";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function POST(
  request: Request
) {
  try {
    /*
     * 1. Authenticate user
     */
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * 2. Parse request body
     */
    const body = await request.json();

    /*
     * 3. Validate case
     */
    const caseResult =
      createCaseSchema.safeParse(
        body.case
      );

    if (!caseResult.success) {
      return NextResponse.json(
        {
          error:
            caseResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 4. Validate documents
     */
    const documents = Array.isArray(
      body.documents
    )
      ? body.documents
      : [];

    const validDocuments = [];

    for (const document of documents) {
      const result =
        documentSchema.safeParse(
          document
        );

      if (!result.success) {
        return NextResponse.json(
          {
            error: "Invalid document",
            details:
              result.error.flatten(),
          },
          {
            status: 400,
          }
        );
      }

      validDocuments.push(
        result.data
      );
    }

    /*
     * 5. Create Case + Documents
     */
    const createdCase =
      await db.case.create({
        data: {
          ...caseResult.data,

          createdById:
            session.userId,

          status: "IN_PROGRESS",

          documents: {
            create:
              validDocuments.map(
                (document) => ({
                  type: document.type,

                  fileUrl:
                    document.fileUrl,

                  fileName:
                    document.fileName,

                  mimeType:
                    document.mimeType,

                  extractedText:
                    document.extractedText,
                })
              ),
          },
        },

        include: {
          documents: true,
        },
      });

    /*
     * 6. Analyse Case with Gemini
     */
    let analysis;

    try {
      analysis =
        await analyseCase({
          title: createdCase.title,

          patientAge:
            createdCase.patientAge,

          patientGender:
            createdCase.patientGender,

          symptoms:
            createdCase.symptoms,

          clinicalNotes:
            createdCase.clinicalNotes,

          documents:
            createdCase.documents,
        });
    } catch (error) {
      console.error(
        "GEMINI ANALYSIS ERROR:",
        error
      );

      /*
       * Gemini failed.
       * Keep the case but mark it OPEN again.
       */
      await db.case.update({
        where: {
          id: createdCase.id,
        },

        data: {
          status: "OPEN",
        },
      });

      return NextResponse.json(
        {
          error:
            "Unable to analyse case",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * 7. Save Analysis
     */
    const savedAnalysis =
      await db.analysis.create({
        data: {
          caseId:
            createdCase.id,

          summary:
            analysis.summary,

          differentialDx:
            analysis.differentialDx,

          redFlags:
            analysis.redFlags,

          recommendations:
            analysis.recommendations,

          aiModel:
            GEMINI_MODEL,
        },
      });

    /*
     * 8. Mark Case Completed
     */
    const completedCase =
      await db.case.update({
        where: {
          id: createdCase.id,
        },

        data: {
          status: "COMPLETED",
        },
      });

    /*
     * 9. Return result
     */
    return NextResponse.json({
      success: true,

      case: {
        id: completedCase.id,
        title: completedCase.title,
        status: completedCase.status,
      },

      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error(
      "CASE ANALYSIS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to analyse case",
      },
      {
        status: 500,
      }
    );
  }
}