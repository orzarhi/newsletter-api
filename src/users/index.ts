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

    return c.json(data)
});

appUser.post('/', userValidator, async (c) => {
    const body = await c.req.parseBody()

    const supabase = getSupabase(c)

    const { data, error } = await supabase.from('users').insert(body).select()

    if (error) {
        return c.text(error.message, { status: 500 })
    }

    return c.json(data)
})

export default appUser;
