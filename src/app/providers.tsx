"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

interface providerProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: providerProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <UserProvider>
          <SessionProvider>{children}</SessionProvider>
        </UserProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default Providers;
