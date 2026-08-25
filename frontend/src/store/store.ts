import { configureStore } from '@reduxjs/toolkit'
import { cartReducer } from '@/features/cart/index'
import { counterReducer } from '@/features/home'
import { cartPersistenceMiddleware } from '@/store/cartPersistenceMiddleware'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
  