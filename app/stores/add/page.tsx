"use client"

import { StoreForm } from "@/components/store-form"
import { useRouter } from "next/navigation"
import type { Store } from "@/lib/features/storeSlice"

export default function AddStorePage() {
  const router = useRouter()

  const handleSave = (store: Store) => {
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
