import { basicAuth } from 'hono/basic-auth'
import { env } from 'hono/adapter'

type Environment = {
    USERNAME: string;
    PASSWORD: string;
}

export const authMiddleware = basicAuth({
    verifyUser: (username, password, c) => {
        const { USERNAME, PASSWORD } = env<Environment>(c)

        return username === USERNAME && password === PASSWORD
    }
})