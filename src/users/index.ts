import { Hono } from "hono";
import { authMiddleware, getSupabase, supabaseMiddleware } from "../middleware";
import { userValidator } from "./validator";

const appUser = new Hono();

appUser.use('*', supabaseMiddleware)

appUser.get("/", authMiddleware, async (c) => {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
        return c.text(error.message, { status: 500 })
    }

    return c.json(data, { status: 200 })
});

appUser.post('/subscribe', userValidator, async (c) => {

    const body = await c.req.json()

    const ratelimit = c.get('rateLimiter')
    const ip = c.req.raw.headers.get('CF-Connecting-IP')

    const { success } = await ratelimit.limit(ip ?? 'anonymous')

    if (!success) {
        return c.text('Rate limit exceeded', { status: 429 })
    }
    const supabase = getSupabase(c)

    const { data } = await supabase.from('users').select('*').eq('email', body.email)

    if (data) {
        return c.text('User already exists', { status: 400 })
    }

    const { error } = await supabase.from('users').insert(body)

    if (error) {
        return c.text(error.message, { status: 500 })
    }

    return c.text('User created', { status: 201 })
})

export default appUser;
