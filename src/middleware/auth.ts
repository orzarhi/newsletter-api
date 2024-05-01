import { basicAuth } from 'hono/basic-auth'

export const authMiddleware = basicAuth({
    verifyUser: (username, password, c) =>
        username === c.env.USERNAME && password === c.env.PASSWORD
})