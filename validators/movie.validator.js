import z from "zod";


export const movieCreateSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(10),
    duration: z.number().positive(),
    genre: z.string().min(2).max(50),
    releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    rating: z.number().min(0).max(10)
});
