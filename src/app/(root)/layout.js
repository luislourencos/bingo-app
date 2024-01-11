"use client"

import { SuperheroProvider } from '@/hooks/SuperheroProvider'

export default function RootLayout({ children }) {
  return (
    <SuperheroProvider>
          {children}
    </SuperheroProvider>
  )
}
