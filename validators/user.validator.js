import z from "zod";

export const registerSchema = z.object(
    {
        name: z.string()
            .min(3,'Name must be at least 3 characters long')
            .max(36,'Name must be at most 36 characters long')
            .regex(/^[a-zA-Z]+$/,name=>'Name must contain only letters'),
        username: z.string()
            .min(3, 'Username must be at least 3 characters')
            .max(36, 'Username must not exceed 36 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
        email:z.string()
            .email('Invalid email address')
            .toLowerCase(),
        password:z.string()
            .min(8,'Password must be at least 8 characters long')
            .max(30,'Password must be at most 30 characters long'),
        role: z.enum(['user','admin']).optional()
    });
export const loginSchema = z.object({
    identifier: z.string()
        .min(3,'Identifier must be at least 3 characters long'),
    password: z.string()
        .min(8,'Password must be at least 8 characters long')
});
