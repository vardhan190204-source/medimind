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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --------------------------------------------------
    // 1. AUTH
    // --------------------------------------------------

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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Case ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 2. GET EXISTING CASE
    // --------------------------------------------------

    const existingCase = await db.case.findFirst({
      where: {
        id,
        createdById: session.userId,
      },
    });

    if (!existingCase) {
      return NextResponse.json(
        {
          error: "Case not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // 3. READ BODY
    // --------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------
    // 4. VALIDATE UPDATED CASE
    // --------------------------------------------------

    const caseResult =
      createCaseSchema.safeParse(body.case);

    if (!caseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid case data",
          details: caseResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 5. VALIDATE NEW DOCUMENTS
    // --------------------------------------------------

    const documents = Array.isArray(body.documents)
      ? body.documents
      : [];

    const validDocuments = [];

    for (const document of documents) {
      const result =
        documentSchema.safeParse(document);

      if (!result.success) {
        return NextResponse.json(
          {
            error: "Invalid document",
            details: result.error.flatten(),
          },
          {
            status: 400,
          }
        );
      }

      validDocuments.push(result.data);
    }

    // --------------------------------------------------
    // 6. UPDATE CASE + ADD NEW DOCUMENTS
    // --------------------------------------------------

    await db.case.update({
      where: {
        id,
      },

      data: {
        ...caseResult.data,

        status: "IN_PROGRESS",

        documents: {
          create: validDocuments.map(
            (document) => ({
              type: document.type,
              fileUrl: document.fileUrl,
              fileName: document.fileName,
              mimeType: document.mimeType,
              extractedText:
                document.extractedText,
            })
          ),
        },
      },
    });

    // --------------------------------------------------
    // 7. FETCH COMPLETE UPDATED CASE
    // --------------------------------------------------

    const updatedCase =
      await db.case.findFirst({
        where: {
          id,
          createdById: session.userId,
        },

        include: {
          documents: true,
        },
      });

    if (!updatedCase) {
      return NextResponse.json(
        {
          error:
            "Unable to load updated case",
        },
        {
          status: 500,
        }
      );
    }

    // --------------------------------------------------
    // 8. SEND EVERYTHING TO GEMINI
    // --------------------------------------------------

    let analysis;

    try {
      analysis = await analyseCase({
        title: updatedCase.title,

        patientAge:
          updatedCase.patientAge,

        patientGender:
          updatedCase.patientGender,

        symptoms:
          updatedCase.symptoms,

        clinicalNotes:
          updatedCase.clinicalNotes,

        documents:
          updatedCase.documents,
      });
    } catch (error) {
      console.error(
        "GEMINI RE-ANALYSIS ERROR:",
        error
      );

      // Gemini failed.
      // Put the case back to OPEN.
      await db.case.update({
        where: {
          id: updatedCase.id,
        },

        data: {
          status: "OPEN",
        },
      });

      return NextResponse.json(
        {
          error:
            "Unable to re-analyse case",
        },
        {
          status: 500,
        }
      );
    }

    // --------------------------------------------------
    // 9. SAVE NEW ANALYSIS
    // --------------------------------------------------

    const savedAnalysis =
      await db.analysis.create({
        data: {
          caseId: updatedCase.id,

          summary:
            analysis.summary,

          differentialDx:
            analysis.differentialDx,

          redFlags:
            analysis.redFlags,

          recommendations:
            analysis.recommendations,

          aiModel: GEMINI_MODEL,
        },
      });

    // --------------------------------------------------
    // 10. MARK CASE COMPLETED
    // --------------------------------------------------

    const completedCase =
      await db.case.update({
        where: {
          id: updatedCase.id,
        },

        data: {
          status: "COMPLETED",
        },
      });

    // --------------------------------------------------
    // 11. RESPONSE
    // --------------------------------------------------

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
      "RE-ANALYSE CASE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to re-analyse case",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}