import { Hono } from 'hono'
import { cors } from 'hono/cors'
import appUser from './users'

const app = new Hono().basePath('/api')

app.use(cors())

app.route('/users', appUser)

export default app
