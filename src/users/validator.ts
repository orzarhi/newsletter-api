import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s]*$/).min(4, { message: 'Name must be at least 4 characters long' }).max(50, { message: 'Name must be at most 50 characters long' }),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
});

export const userValidator = zValidator('json', userSchema);