import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s]*$/),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
});

export const userValidator = zValidator('form', userSchema);