import { configureStore } from "@reduxjs/toolkit"
import storeSlice from "./features/storeSlice"

export const store = configureStore({
  reducer: {
    stores: storeSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
