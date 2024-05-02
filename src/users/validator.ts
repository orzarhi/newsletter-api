import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const userSchema = z.object({
    fullName: z.string().regex(/^[a-zA-Z\s]*$/).min(4, { message: 'Full name must be at least 4 characters long' })
        .max(20, { message: 'Full name must be at most 20 characters long' }).refine(data => data.trim().split(' ').length > 1, { message: 'Full name must contain first and last name' }),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
});

export const userValidator = zValidator('json', userSchema);