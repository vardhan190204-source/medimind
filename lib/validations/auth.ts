import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must contain at least 2 characters"),

    username: z
      .string()
      .min(3, "Username must contain at least 3 characters")
      .max(30, "Username is too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and _",
      ),

    password: z.string().min(8, "Password must contain at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});
