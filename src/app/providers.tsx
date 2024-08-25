"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./auth/UserContext";

interface providerProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: providerProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>{children}</UserContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
