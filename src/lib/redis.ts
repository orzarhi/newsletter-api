import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { Context, Env } from "hono"
import { env } from "hono/adapter"
import { BlankInput } from "hono/types"

declare module "hono" {
    interface ContextVariableMap {
        rateLimiter: Ratelimit
    }
}

const cache = new Map()

type Environment = {
    REDIS_UEL: string
    REDIS_TOKEN: string
}

export class RedisRateLimiter {
    static instance: Ratelimit

    static getInstance(c: Context<Env, '/subscribe', BlankInput>) {
        if (!this.instance) {
            const { REDIS_TOKEN, REDIS_UEL } = env<Environment>(c)

            const redisClient = new Redis({
                url: REDIS_UEL,
                token: REDIS_TOKEN
            })

            const rateLimiter = new Ratelimit({
                redis: redisClient,
                limiter: Ratelimit.slidingWindow(10, "10s"),
                ephemeralCache: cache
            })

            this.instance = rateLimiter

            return this.instance
        } else {
            return this.instance
        }
    }
}
