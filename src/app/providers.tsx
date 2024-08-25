"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./auth/UserContext";
// import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface providerProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: providerProps) => {
  return (
    // <GoogleReCaptchaProvider
    //   reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    // >
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>{children}</UserContextProvider>
    </QueryClientProvider>
    // </GoogleReCaptchaProvider>
  );
};

export default Providers;
