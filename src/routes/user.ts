import { Hono } from 'hono'
import { auth } from '@/middlewares'
import { db } from '@/utils'

const userRouter = new Hono()

userRouter.use('*', auth)
userRouter.delete('/del/:id', async c => {
  const { id } = c.req.param()  
  if (!id) return c.json({ message: 'O campo: id é obrigatório.' })

  try {
    await db.user.delete({ where: { id: Number(id) } })
    return c.json({ user: `Usuário ID: ${id} removido.` })
  } catch (error) {
    return c.json({ message: `Erro ao apagar usuário ID: ${id}, Erro: ${error}` })      
  }
})

const userNoAuthRouter = new Hono()
userNoAuthRouter.post('/signup', async c => {
  const data = await c.req.json()
  if (!data || !data.name || !data.email || !data.password) return c.json({ message: 'Os campos: nome, email e senha são obrigatórios.' })

  const user = await db.user.create({ data })
  if (user) return c.json({ user: 'Usuário criado.' })
  
  return c.json({ message: 'Erro ao criar usuário.' })  
})

userNoAuthRouter.post('/signin', async c => {
  const data = await c.req.json()
  if (!data || !data.email || !data.password) return c.json({ message: 'Os campos: email e senha são obrigatórios.' })

  const user = await db.user.create({ data })
  if (user) return c.json({ user: 'Usuário criado.' })
  
  return c.json({ message: 'Erro ao criar usuário.' })  
})

userNoAuthRouter.get('/all', async (c) => {
  const users = await db.user.findMany({})
  const total = await db.user.count({})

  if (users) 
    return c.json({ users, total })

  return c.json({ message: 'Erro ao recuperar usuários' })
})

export { userRouter, userNoAuthRouter }
