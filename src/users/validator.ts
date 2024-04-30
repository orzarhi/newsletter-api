import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});

export const userValidator = zValidator('form', userSchema);