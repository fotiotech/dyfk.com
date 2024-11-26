import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    product: productReducer, // Add other reducers here as needed
  },
});

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
