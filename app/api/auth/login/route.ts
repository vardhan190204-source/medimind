import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Username and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to login",
      },
      {
        status: 500,
      }
    );
  }
}

