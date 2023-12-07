import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { userRouter } from '@/routes'

const app = new Hono()
const prisma = new PrismaClient()

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: "Alice",
  //     email: "alice@prisma.io",
  //     posts: { create: { title: "Hello World" }},
  //     profile: { create: { bio: "I like turtles" }}
  //   }
  // })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true
    }
  })

  console.dir(allUsers, { depth: null })
}

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

app.route('/user', userRouter)

app.get('/', (c) => c.text('Hello Hono!'))

export default { port: 3004, fetch: app.fetch }
