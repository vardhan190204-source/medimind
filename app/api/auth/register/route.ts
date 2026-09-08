import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { db } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      username,
      password,
    } = result.data;

    const existingUser =
      await db.user.findUnique({
        where: {
          username,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Username already exists",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await hash(
      password,
      12
    );

    const user = await db.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

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
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create account",
      },
      {
        status: 500,
      }
    );
  }
}