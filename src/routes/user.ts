import { Hono } from 'hono'

const userRouter = new Hono()

userRouter.get('/users', async (c) => {
  return c.json({ user: 'Users Route' })
})

// userRouter.get('/users/:id', async (c) => {
//   // lógica para obter um usuário específico
// });

// Exporte o roteador
export { userRouter }