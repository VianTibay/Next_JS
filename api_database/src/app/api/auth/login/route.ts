// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../../lib/prisma' // 🛠️ use named import
import { signSession } from '../../../../../lib/auth'
import { cookies } from 'next/headers'

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

    // ✅ compare with passwordHash
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // sign session token
    const token: string = await signSession({ userId: user.id, email: user.email })

    // ✅ set cookie
    ;(await
      // ✅ set cookie
      cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      message: 'Login successful',
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
