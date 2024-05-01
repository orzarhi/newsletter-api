import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Context, MiddlewareHandler } from 'hono'

export const supabaseMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        if (!c.env.SUPABASE_URL) {
            throw new Error('SUPABASE_URL is required')
        }

        if (!c.env.SUPABASE_KEY) {
            throw new Error('SUPABASE_KEY is required')
        }

        const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)

        c.set(c.env.ID_TOKEN_CONTEXT, supabase)

        await next()
    } catch (error) {
        // @ts-expect-error
        return c.text(error.message, { status: 500 })
    }
}

export const getSupabase = (c: Context): SupabaseClient => c.get(c.env.ID_TOKEN_CONTEXT)
