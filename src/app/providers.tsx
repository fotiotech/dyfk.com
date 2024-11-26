"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux"; // Redux Provider
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { store } from "./store/store"; // Your Redux store

interface ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <CartProvider>
          <UserProvider>
            <SessionProvider>{children}</SessionProvider>
          </UserProvider>
        </CartProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

export default Providers;
