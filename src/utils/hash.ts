export async function encrypt(password: string) {
  const hash = await Bun.password.hash(password)
  return hash
}

export async function verify(password: string, hash: string) {
  const isMatch = await Bun.password.verify(password, hash)
  return isMatch
}