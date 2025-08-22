'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: string; email: string; name?: string | null }

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/me', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
      setLoading(false)
    })()
  }, [router])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) return <main className="p-6">Loading...</main>

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user ? (
          <>
            <p>Welcome, <b>{user.name || user.email}</b>!</p>
            <button onClick={logout} className="px-4 py-2 rounded bg-black text-white">
              Log out
            </button>
          </>
        ) : (
          <p>Not logged in.</p>
        )}
      </div>
    </main>
  )
}
