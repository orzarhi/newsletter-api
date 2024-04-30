import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { MiddlewareHandler } from 'hono'


export const idTokenContext = 'supabase-id'

export const supabaseMiddleware: MiddlewareHandler = async () => {

}