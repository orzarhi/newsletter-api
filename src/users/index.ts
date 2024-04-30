import { Hono } from "hono";
import { userValidator } from "./validator";

const appUser = new Hono();

appUser.get("/", async (c) => {
    return c.json({ users: ["Alice", "Bob", "Charlie"] });
});

appUser.post('/', userValidator, async (c) => {
    const body = await c.req.parseBody()

    return c.json({ body })
})

export default appUser;
