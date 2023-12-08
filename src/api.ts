import { Hono } from 'hono'
import { userRouter } from '@/routes'

const app = new Hono()

app.route('/user', userRouter)

app.get('/', (c) => c.text('Hello Hono!'))

export default { port: 3004, fetch: app.fetch }
