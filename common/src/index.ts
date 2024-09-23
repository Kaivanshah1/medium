import z from 'zod';

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),    
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const createBlogSchema = z.object({
    title: z.string(),
    content: z.string()
});

export const updateBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
});

export type signUpInput = z.infer<typeof signUpSchema>;
export type signInInput = z.infer<typeof signInSchema>;
export type updateBlogInput = z.infer<typeof updateBlogSchema>;
export type createBlogInput = z.infer<typeof createBlogSchema>;