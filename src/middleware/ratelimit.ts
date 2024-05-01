import { Context, MiddlewareHandler } from "hono";
import { RedisRateLimiter } from "../lib/redis";

export const ratelimitMiddleware: MiddlewareHandler = (c, next) => {
    const rateLimiter = RedisRateLimiter.getInstance(c)
    c.set('rateLimiter', rateLimiter)

    return next()
}