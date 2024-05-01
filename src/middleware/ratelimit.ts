import { MiddlewareHandler } from "hono";
import { RedisRateLimiter } from "../lib/redis";

export const ratelimitMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        const ratelimit = RedisRateLimiter.getInstance(c)
        c.set('ratelimit', ratelimit)

        await next()
    } catch (error) {
        console.log(error);
        return c.text('Internal server error', { status: 500 })
    }
}