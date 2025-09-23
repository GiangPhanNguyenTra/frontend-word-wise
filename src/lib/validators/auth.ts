import * as z from "zod";

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: passwordValidation,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // path of error
  });

export const ForgotPasswordStep1Schema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const ForgotPasswordStep2Schema = z.object({
  code: z.string().min(4, { message: "Verification code must be 4 digits." }),
});

export const ForgotPasswordStep3Schema = z
  .object({
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
