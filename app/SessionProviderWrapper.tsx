'use client'

import { SessionProvider } from 'next-auth/react'

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Re-fetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}