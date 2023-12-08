
import { sign } from 'hono/jwt'
import { User } from '@prisma/client'

// Usually I keep the token between 5 minutes - 15 minutes
export async function generateAccessToken(user: User) {
  const secret = Bun.env.JWT_ACCESS_SECRET
  if (!secret) throw new Error('Senha de acesso JWT não configurada.')

  const payload = {
    sub: user.id,
    name: user.name,
    role: 'admin'
  }

  const token = await sign(payload, secret)
  return token
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
async function generateRefreshToken(user: User, jti: string) {
  const secret = Bun.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('Senha de refresh JWT não configurada.')

  const iat = new Date().getSeconds()
  const exp = iat + 21599

  const payload = {
    sub: user.id,
    name: user.name,
    role: 'admin'
  }

  const token = await sign(payload, secret)

  return token

  // return jwt.sign({
  //   userId: user.id,
  //   jti
  // }, process.env.JWT_REFRESH_SECRET, {
  //   expiresIn: '8h',
  // });
}

export async function generateTokens(user: User, jti: string) {
  const accessToken = await generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user, jti)
  return { accessToken, refreshToken }
}