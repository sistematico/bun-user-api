import { Hono } from 'hono'
import { userRouter, userNoAuthRouter } from '@/routes'

const app = new Hono()

app.route('/user', userRouter)
app.route('/user', userNoAuthRouter)

app.get('/', (c) => c.text('User API'))

export default { port: 3004, fetch: app.fetch }
