"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchStoreById, clearCurrentStore } from "@/lib/features/storeSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Calendar, Edit, ExternalLink } from "lucide-react"
import Image from "next/image"

interface StoreDetailProps {
  storeId: string
  onEdit?: (storeId: string) => void
  onBack?: () => void
}

export function StoreDetail({ storeId, onEdit, onBack }: StoreDetailProps) {
  const dispatch = useAppDispatch()
  const { currentStore, loading, error } = useAppSelector((state) => state.stores)

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreById(storeId))
    }

    return () => {
      dispatch(clearCurrentStore())
    }
  }, [dispatch, storeId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Error loading store</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={() => dispatch(fetchStoreById(storeId))} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentStore) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-medium">Store not found</p>
              <p className="text-sm text-muted-foreground mt-1">The store you're looking for doesn't exist.</p>
              <Button onClick={onBack} className="mt-4 bg-transparent" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stores
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${currentStore.latitude},${currentStore.longitude}`
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentStore.name}</h1>
            <p className="text-muted-foreground">Store Details</p>
          </div>
        </div>
        <Button onClick={() => onEdit?.(currentStore.id)} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Store
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative h-64 sm:h-80 w-full rounded-md overflow-hidden">
              <Image
                src={currentStore.image || "/placeholder.svg"}
                alt={currentStore.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{currentStore.name}</CardTitle>
                <CardDescription className="text-base mt-2">{currentStore.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-4">
                {currentStore.alias}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="space-y-2 text-sm">
                {currentStore.address && <p className="text-muted-foreground">{currentStore.address}</p>}
                <div className="flex items-center justify-between">
                  <div>
                    <p>
                      <span className="font-medium">Latitude:</span> {currentStore.latitude}
                    </p>
                    <p>
                      <span className="font-medium">Longitude:</span> {currentStore.longitude}
                    </p>
                  </div>
                  <Button onClick={openInMaps} size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Maps
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Metadata */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store ID:</span>
                  <span className="font-mono">{currentStore.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(currentStore.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alias:</span>
                  <span className="font-mono">{currentStore.alias}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Store Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{currentStore.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
