import { Hono } from "hono";
import { userValidator } from "./validator";
import { getSupabase, supabaseMiddleware } from "../middleware/supabase";

const appUser = new Hono();

appUser.use('*', supabaseMiddleware)

appUser.get("/", async (c) => {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
        return c.text(error.message, { status: 500 })
    }

    return c.json(data, { status: 200 })
});

appUser.post('/', userValidator, async (c) => {
    const body = await c.req.parseBody()

    const supabase = getSupabase(c)

    const { error } = await supabase.from('users').insert(body)

    if (error) {
        return c.text(error.message, { status: 500 })
    }

    return c.text('User created', { status: 201 })
})

export default appUser;
