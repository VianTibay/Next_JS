// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { verifySession } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get('session')?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  try {
    const payload = await verifySession(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    })
    if (!user) return NextResponse.json({ user: null }, { status: 401 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
