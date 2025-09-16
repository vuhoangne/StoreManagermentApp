"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createStore, updateStore, fetchStoreById, clearCurrentStore, clearError } from "@/lib/features/storeSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Upload, MapPin, AlertCircle } from "lucide-react"
import type { Store } from "@/lib/features/storeSlice"

interface StoreFormProps {
  storeId?: string
  onSave?: (store: Store) => void
  onCancel?: () => void
}

interface FormData {
  name: string
  alias: string
  description: string
  latitude: string
  longitude: string
  address: string
  image: string
  thumbnail: string
}

interface FormErrors {
  name?: string
  alias?: string
  description?: string
  latitude?: string
  longitude?: string
  image?: string
}

export function StoreForm({ storeId, onSave, onCancel }: StoreFormProps) {
  const dispatch = useAppDispatch()
  const { currentStore, loading, error } = useAppSelector((state) => state.stores)
  const isEditing = Boolean(storeId)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    alias: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    image: "",
    thumbnail: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing && storeId) {
      dispatch(fetchStoreById(storeId))
    } else {
      dispatch(clearCurrentStore())
    }

    return () => {
      dispatch(clearError())
    }
  }, [dispatch, isEditing, storeId])

  useEffect(() => {
    if (currentStore && isEditing) {
      setFormData({
        name: currentStore.name,
        alias: currentStore.alias,
        description: currentStore.description,
        latitude: currentStore.latitude.toString(),
        longitude: currentStore.longitude.toString(),
        address: currentStore.address || "",
        image: currentStore.image,
        thumbnail: currentStore.thumbnail,
      })
    }
  }, [currentStore, isEditing])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Store name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Store name must be at least 2 characters"
    }

    // Alias validation
    if (!formData.alias.trim()) {
      newErrors.alias = "Store alias is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.alias)) {
      newErrors.alias = "Alias must contain only lowercase letters, numbers, and hyphens"
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    // Latitude validation
    const lat = Number.parseFloat(formData.latitude)
    if (!formData.latitude.trim()) {
      newErrors.latitude = "Latitude is required"
    } else if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = "Latitude must be a number between -90 and 90"
    }

    // Longitude validation
    const lng = Number.parseFloat(formData.longitude)
    if (!formData.longitude.trim()) {
      newErrors.longitude = "Longitude is required"
    } else if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = "Longitude must be a number between -180 and 180"
    }

    // Image validation
    if (!formData.image.trim()) {
      newErrors.image = "Store image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const generateAlias = () => {
    const alias = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    handleInputChange("alias", alias)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const storeData = {
        name: formData.name.trim(),
        alias: formData.alias.trim(),
        description: formData.description.trim(),
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
        address: formData.address.trim(),
        image: formData.image.trim(),
        thumbnail: formData.thumbnail.trim() || formData.image.trim(),
      }

      let result
      if (isEditing && storeId) {
        result = await dispatch(updateStore({ id: storeId, ...storeData }))
      } else {
        result = await dispatch(createStore(storeData))
      }

      if (result.type.endsWith("/fulfilled")) {
        onSave?.(result.payload as Store)
      }
    } catch (err) {
      console.error("Error saving store:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (field: "image" | "thumbnail") => {
    // In a real app, this would handle file upload
    // For now, we'll use placeholder URLs
    const placeholderUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(formData.name || "store")}`
    handleInputChange(field, placeholderUrl)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onCancel} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Store" : "Add New Store"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update store information" : "Create a new store location"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter store name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="alias">Store Alias *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={generateAlias} disabled={!formData.name}>
                    Generate
                  </Button>
                </div>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) => handleInputChange("alias", e.target.value)}
                  placeholder="store-alias"
                  className={errors.alias ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
                {errors.alias && <p className="text-sm text-destructive">{errors.alias}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your store..."
                  rows={4}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter store address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Set the geographic coordinates for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    placeholder="10.762622"
                    className={errors.latitude ? "border-destructive" : ""}
                  />
                  {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    placeholder="106.660172"
                    className={errors.longitude ? "border-destructive" : ""}
                  />
                  {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> You can find coordinates by searching for your location on Google Maps,
                  right-clicking on the location, and selecting the coordinates that appear.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Store Images</CardTitle>
            <CardDescription>Upload images to showcase your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image">Main Image *</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Image URL or upload"
                    className={errors.image ? "border-destructive" : ""}
                  />
                  <Button type="button" variant="outline" onClick={() => handleImageUpload("image")}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="flex gap-2">
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                    placeholder="Thumbnail URL (optional)"
                  />
                  <Button type="button" variant="outline" onClick={() => handleImageUpload("thumbnail")}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">If not provided, main image will be used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Store"
                    : "Create Store"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
