import z from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
});

export type signIpInput = z.infer<typeof signInSchema>;
