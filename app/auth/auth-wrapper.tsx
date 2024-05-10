'use client'
import { useEffect, useState } from "react"
import { LoadingSkeleton } from "./loading-skeleton"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingSkeleton />
  }

  return (
    <>{ children }</>
  )
}