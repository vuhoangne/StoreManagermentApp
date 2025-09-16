import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Store {
  id: string
  name: string
  alias: string
  description: string
  latitude: number
  longitude: number
  image: string
  thumbnail: string
  address?: string
  createdAt: string
}

export interface StoreState {
  stores: Store[]
  currentStore: Store | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  searchQuery: string
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  searchQuery: "",
}

// Mock API functions - replace with real API calls
const mockStores: Store[] = [
  {
    id: "1",
    name: "Tech Store Central",
    alias: "tech-store-central",
    description: "Your one-stop shop for all technology needs including laptops, smartphones, accessories, and more.",
    latitude: 10.762622,
    longitude: 106.660172,
    image: "/modern-tech-store.png",
    thumbnail: "/tech-store-storefront.jpg",
    address: "123 Tech Street, District 1, Ho Chi Minh City",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Fashion Hub",
    alias: "fashion-hub",
    description:
      "Latest trends and timeless classics for men and women. Discover your style with our curated collection.",
    latitude: 10.775181,
    longitude: 106.700806,
    image: "/modern-fashion-store.png",
    thumbnail: "/fashion-boutique-storefront.png",
    address: "456 Fashion Ave, District 3, Ho Chi Minh City",
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Coffee Corner",
    alias: "coffee-corner",
    description:
      "Premium coffee and cozy atmosphere. Perfect place to work, meet friends, or just enjoy a great cup of coffee.",
    latitude: 10.78,
    longitude: 106.695,
    image: "/cozy-coffee-shop.png",
    thumbnail: "/cozy-coffee-shop.png",
    address: "789 Coffee Lane, District 2, Ho Chi Minh City",
    createdAt: "2024-02-01T09:15:00Z",
  },
]

// Async thunks
export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async ({ page = 1, search = "" }: { page?: number; search?: string }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredStores = mockStores
    if (search) {
      filteredStores = mockStores.filter(
        (store) =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.alias.toLowerCase().includes(search.toLowerCase()) ||
          store.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const itemsPerPage = 10
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedStores = filteredStores.slice(startIndex, endIndex)

    return {
      stores: paginatedStores,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredStores.length / itemsPerPage),
        totalItems: filteredStores.length,
        itemsPerPage,
      },
    }
  },
)

export const fetchStoreById = createAsyncThunk("stores/fetchStoreById", async (id: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const store = mockStores.find((s) => s.id === id)
  if (!store) {
    throw new Error("Store not found")
  }
  return store
})

export const createStore = createAsyncThunk(
  "stores/createStore",
  async (storeData: Omit<Store, "id" | "createdAt">) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newStore: Store = {
      ...storeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    mockStores.unshift(newStore) // Add to beginning of array for better UX
    return newStore
  },
)

export const updateStore = createAsyncThunk(
  "stores/updateStore",
  async ({ id, ...storeData }: Partial<Store> & { id: string }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const index = mockStores.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error("Store not found")
    }

    mockStores[index] = { ...mockStores[index], ...storeData }
    return mockStores[index]
  },
)

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearCurrentStore: (state) => {
      state.currentStore = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stores
      .addCase(fetchStores.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false
        state.stores = action.payload.stores
        state.pagination = action.payload.pagination
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch stores"
      })
      // Fetch store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false
        state.currentStore = action.payload
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch store"
      })
      // Create store
      .addCase(createStore.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false
        state.stores.unshift(action.payload)
        state.pagination.totalItems += 1
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create store"
      })
      // Update store
      .addCase(updateStore.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false
        const index = state.stores.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.stores[index] = action.payload
        }
        if (state.currentStore?.id === action.payload.id) {
          state.currentStore = action.payload
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update store"
      })
  },
})

export const { setSearchQuery, clearCurrentStore, clearError } = storeSlice.actions
export default storeSlice.reducer
