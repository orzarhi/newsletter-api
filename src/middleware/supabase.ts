import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Context, MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'

type Environment = {
    SUPABASE_URL: string
    SUPABASE_KEY: string
    ID_TOKEN_CONTEXT: string
}

export const supabaseMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        const { SUPABASE_URL, SUPABASE_KEY, ID_TOKEN_CONTEXT } = env<Environment>(c)

        if (!SUPABASE_URL) {
            throw new Error('SUPABASE_URL is required')
        }

        if (!SUPABASE_KEY) {
            throw new Error('SUPABASE_KEY is required')
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

        c.set(ID_TOKEN_CONTEXT, supabase)

        await next()
    } catch (error) {
        // @ts-expect-error
        return c.text(error.message, { status: 500 })
    }
}

export const getSupabase = (c: Context): SupabaseClient => {
    const { ID_TOKEN_CONTEXT } = env<Environment>(c)

    return c.get(ID_TOKEN_CONTEXT)
}
