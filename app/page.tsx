"use client"

import { useState } from "react"
import { StoreList } from "@/components/store-list"
import { StoreForm } from "@/components/store-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import type { Store } from "@/lib/features/storeSlice"

export default function HomePage() {
  const router = useRouter()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null)

  const handleAddStore = () => {
    setShowAddDialog(true)
  }

  const handleEditStore = (storeId: string) => {
    setEditingStoreId(storeId)
    setShowEditDialog(true)
  }

  const handleSaveStore = (store: Store) => {
    setShowAddDialog(false)
    setShowEditDialog(false)
    setEditingStoreId(null)
    // The store list will automatically refresh due to Redux state updates
  }

  const handleCancelForm = () => {
    setShowAddDialog(false)
    setShowEditDialog(false)
    setEditingStoreId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreList onAddStore={handleAddStore} onEditStore={handleEditStore} />

      {/* Add Store Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
          </DialogHeader>
          <StoreForm onSave={handleSaveStore} onCancel={handleCancelForm} />
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
          </DialogHeader>
          {editingStoreId && (
            <StoreForm storeId={editingStoreId} onSave={handleSaveStore} onCancel={handleCancelForm} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
