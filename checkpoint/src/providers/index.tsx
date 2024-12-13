"use client";
import React, { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AuthProvider from "./AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import AnimateProvider from "./AnimateProvider";
import TourProvider from "./TourProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider>
      <QueryProvider>
        <AuthProvider>
          <AnimateProvider>
            <TourProvider>
              {children}
            </TourProvider>
          </AnimateProvider>
        </AuthProvider>
      </QueryProvider>
    </ChakraProvider>
  );
};

export default Providers;
