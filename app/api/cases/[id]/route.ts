import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/cases/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 },
      );
    }

    const caseData = await db.case.findFirst({
      where: {
        id,
        createdById: session.userId,
      },

      include: {
        documents: true,
        analyses: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    console.log("GET CASE DEBUG:", {
      caseId: id,
      sessionUserId: session.userId,
      found: !!caseData,
    });

    if (!caseData) {
      return NextResponse.json(
        {
          error: "Case not found",
          debug: {
            caseId: id,
            userId: session.userId,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("GET CASE ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch case",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/cases/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Case ID is required" },
        { status: 400 },
      );
    }

    const existingCase = await db.case.findFirst({
      where: {
        id,
        createdById: session.userId,
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    await db.case.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CASE ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to delete case",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
