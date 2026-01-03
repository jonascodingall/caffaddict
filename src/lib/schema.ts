import { z } from "zod/v4";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type LoginFormSchema = typeof loginSchema;

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters long."),
        email: z.email("Please enter a valid email address."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
        passwordConfirm: z.string().min(8, "Please confirm your password."),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match.",
        path: ["passwordConfirm"],
    });

export type RegisterFormSchema = typeof registerSchema;

export const taskCreateSchema = z.object({
    title: z.string().min(1, "Title cannot be empty."),
    description: z.string().optional(),
    dueDate: z.string().min(1, "Due Date kannt be empty."),

    priority: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.coerce.number().int().min(1).max(3).optional()
    ),
});

export type TaskCreateFormSchema = typeof taskCreateSchema;
