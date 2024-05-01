import { Hono } from "hono";
import { authMiddleware, getSupabase, ratelimitMiddleware, supabaseMiddleware } from "../middleware";
import { userValidator } from "./validator";

const appUser = new Hono();

appUser.use('*', supabaseMiddleware, ratelimitMiddleware)

appUser.get("/", authMiddleware, async (c) => {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
        return c.json(error.message, { status: 500 })
    }

    return c.json(data, { status: 200 })
});

appUser.post('/subscribe', userValidator, async (c) => {
    try {
        const ratelimit = c.get('ratelimit')

        const ip = c.req.raw.headers.get('CF-Connecting-IP')

        const { success } = await ratelimit.limit(ip ?? 'anonymous')

        if (!success) {
            return c.json('Rate limit exceeded', { status: 429 })
        }

        const body = await c.req.json()

        const supabase = getSupabase(c)

        const { data } = await supabase.from('users').select('*').eq('email', body.email)

        if (data?.length) {
            return c.json('Email already exists', { status: 403 })
        }

        const { error } = await supabase.from('users').insert(body)

        if (error) {
            return c.json(error.message, { status: 500 })
        }

        return c.json('Subscribed successfully', { status: 201 })
    } catch (error) {
        return c.json(error, { status: 500 })
    }
})

export default appUser;
