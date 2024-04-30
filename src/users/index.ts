import { Hono } from "hono";
import { userValidator } from "./validator";
import { getSupabase, supabaseMiddleware } from "../middleware/supabase";

const appUser = new Hono();

appUser.use('*', supabaseMiddleware)

appUser.get("/", async (c) => {
    const supabase = getSupabase(c)
    const { data, error } = await supabase.from('users').select('*')
});

appUser.post('/', userValidator, async (c) => {
    const body = await c.req.parseBody()

    return c.json({ body })
})

export default appUser;
