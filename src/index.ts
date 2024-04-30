import { Hono } from 'hono'
import { cors } from 'hono/cors'
import appUser from './users'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono().basePath('/api')

app.use(cors())

app.get('/', async (c) => {
  return c.json('Hello World!')
})

app.get('/ui', swaggerUI({ url: '/doc' }))


app.route('/users', appUser)

export default app
