"use client"

import { StoreForm } from "@/components/store-form"
import { useRouter } from "next/navigation"
import type { Store } from "@/lib/features/storeSlice"

interface EditStorePageProps {
  params: {
    id: string
  }
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const router = useRouter()

  const handleSave = (store: Store) => {
    router.push(`/stores/${store.id}`)
  }

  const handleCancel = () => {
    router.push(`/stores/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreForm storeId={params.id} onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
