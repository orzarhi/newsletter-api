import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis/cloudflare"
import { Context, Env } from "hono"
import { env } from "hono/adapter"
import { BlankInput } from "hono/types"

declare module "hono" {
    interface ContextVariableMap {
        ratelimit: Ratelimit
    }
}

const cache = new Map()

type Environment = {
    REDIS_UEL: string
    REDIS_TOKEN: string
}

export class RedisRateLimiter {
    static instance: Ratelimit

    static getInstance(c: Context<Env, '/api/users/subscribe', BlankInput>) {
        if (!this.instance) {
            const { REDIS_TOKEN, REDIS_UEL } = env<Environment>(c)

            const redisClient = new Redis({
                url: REDIS_UEL,
                token: REDIS_TOKEN
            })

            const ratelimit = new Ratelimit({
                redis: redisClient,
                limiter: Ratelimit.slidingWindow(3, "10s"),
                ephemeralCache: cache
            })

            this.instance = ratelimit

            return this.instance
        } else {
            return this.instance
        }
    }
}
