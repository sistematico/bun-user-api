import { Hono } from 'hono'
import { sign } from 'hono/jwt'
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
    return c.json({
      message: `Erro ao apagar usuário ID: ${id}, Erro: ${error}`
    })
  }
})

const userNoAuthRouter = new Hono()
userNoAuthRouter.post('/signup', async c => {
  const data = await c.req.json()
  if (!data || !data.name || !data.email || !data.password) return c.json({ message: 'Os campos: nome, email e senha são obrigatórios.' })

  const hash = await Bun.password.hash(data.password)
  data.password = hash

  const userExists = await db.user.findMany({
    where: {
      OR: [
        { name: data.name },
        { email: data.email },
      ],
    },
  })
  if (userExists.length > 0) return c.json({ user: 'O usuário/e-mail já existe.' })

  const user = await db.user.create({ data })
  if (user) return c.json({ user: 'Usuário criado.' })

  return c.json({ message: 'Erro ao criar usuário.' })
})

// Login
userNoAuthRouter.post('/signin', async c => {
  if (!Bun.env.JWT_ACCESS_SECRET || !Bun.env.JWT_REFRESH_SECRET) return c.json({ message: 'As senhas JWT precisam ser configuradas.' })

  const data = await c.req.json()
  if (!data || !data.email || !data.password) return c.json({ message: 'Os campos: email e senha são obrigatórios.' })

  const user = await db.user.findUnique({ where: { email: data.email } })
  if (!user) return c.json({ message: 'Usuário não encontrado.' })

  const isMatch = await Bun.password.verify(data.password, user.password)
  if (!isMatch) return c.json({ message: 'Credenciais inválidas' }, 401)

  const now = Math.floor(Date.now() / 1000)
  const minutes = 15
  const days = 7

  const payload = { sub: user.id, name: user.name, role: 'admin' }
  
  // Criação do token de acesso com expiração de 15 minutos
  const accessToken = await sign({ ...payload, iat: now, nbf: now, exp: now + 60 * minutes }, Bun.env.JWT_ACCESS_SECRET)

  // Criação do token de refresh com expiração de 7 dias
  const refreshToken = await sign({ ...payload, iat: now, nbf: now, exp: now + 60 * 60 * 24 * days }, Bun.env.JWT_REFRESH_SECRET)

  // Retorne ambos os tokens na resposta
  return c.json({ tokens: { access: accessToken, refresh: refreshToken }})
})

userNoAuthRouter.get('/all', async c => {
  const users = await db.user.findMany({})
  const total = await db.user.count({})

  if (users) return c.json({ users, total })

  return c.json({ message: 'Erro ao recuperar usuários' })
})

export { userRouter, userNoAuthRouter }
