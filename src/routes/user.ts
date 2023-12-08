import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const userRouter = new Hono()
const prisma = new PrismaClient()

userRouter.post('/add', async c => {
  const data = await c.req.json()
  if (!data || !data.name || !data.email || !data.password) return c.json({ message: 'Os campos: nome, email e senha são obrigatórios' })
  const user = await prisma.user.create({ data })
  if (user) return c.json({ user: 'Usuário criado' })
  return c.json({ message: 'Erro ao criar usuário' })  
})

userRouter.get('/all', async (c) => {
  // const users = await prisma.user.findMany({
  //   include: {
  //     posts: true,
  //     profile: true,
  //   }
  // })
  const users = await prisma.user.findMany({})
  const total = await prisma.user.count({})

  // if (users) return c.json(JSON.stringify(users))
  if (users) return c.json({ users, total })
  return c.json({ message: 'Erro ao recuperar usuários' })
})

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

// userRouter.get('/users/:id', async (c) => {
//   // lógica para obter um usuário específico
// });

export { userRouter }
