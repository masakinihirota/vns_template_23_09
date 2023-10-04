"use client"

import { useSearchParams } from "next/navigation"

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")
  return (
    <>
      {error && (
        // <p className="p-4 mt-4 text-center bg-neutral-900 text-neutral-300">
        <p className="">{error}</p>
      )}
      {message && (
        // <p className="p-4 mt-4 text-center bg-neutral-900 text-neutral-300">
        <p className="">{message}</p>
      )}
    </>
  )
}
