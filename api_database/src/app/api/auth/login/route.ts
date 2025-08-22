// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../../lib/prisma'
import { signSession } from '../../../../../lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // ✅ compare with passwordHash instead of password
    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // sign session token
    const token = await signSession({ userId: user.id, email: user.email })

    return NextResponse.json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
