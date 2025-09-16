"use client"

import { StoreDetail } from "@/components/store-detail"
import { useRouter } from "next/navigation"

interface StoreDetailPageProps {
  params: {
    id: string
  }
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  const router = useRouter()

  const handleEdit = (storeId: string) => {
    router.push(`/stores/${storeId}/edit`)
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreDetail storeId={params.id} onEdit={handleEdit} onBack={handleBack} />
    </div>
  )
}
