import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
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

    const cases = await db.case.findMany({
      where: {
        createdById: session.userId,
      },

      select: {
        id: true,
        title: true,
        patientAge: true,
        patientGender: true,
        status: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch cases",
      },
      {
        status: 500,
      }
    );
  }
}