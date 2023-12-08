import { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'
import { db } from '@/utils'

export const auth: MiddlewareHandler = async (c, next) => {
  if (!Bun.env.JWT_ACCESS_SECRET) return c.json({ message: 'O JWT Access Secret não foi encontrado.'})

  const authHeader = c.req.header('Authorization')
  if (!authHeader) return c.json({ message: 'Token de acesso não fornecido.' }, 401)
  
  const token = authHeader.split(' ')[1]
  if (!token) return c.json({ message: 'Token de acesso mal formatado.' }, 401)

  try {
    const decoded = verify(token, Bun.env.JWT_ACCESS_SECRET)
    const storedToken = await db.token.findFirst({ where: { token } })

    if (!storedToken) return c.json({ message: 'Token de acesso inválido.' }, 401)

    c.set('user', decoded) // Decoded token payload
    await next()
  } catch (error) {
    return c.json({ message: 'Token de acesso inválido ou expirado.' }, 401)
  }
}