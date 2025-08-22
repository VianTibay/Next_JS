// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { signSession } from '../../../../../lib/auth'

export const runtime = 'nodejs'

export  async function GET() { 
return NextResponse.json({ message: 'Signup API' })
}




export async function POST(req: Request) {
  try {
    const body = await req.json()
  const schema = z.object({
  name: z.string().min(1).max(100).optional().or(z.literal('')),
  email: z.string().email(),
  password: z.string().min(8).max(72),
})

    const { name, email, password } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true, name: true },
    })

    // set session cookie
    const token = await signSession({ userId: user.id, email: user.email })
    const res = NextResponse.json({ user })
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
