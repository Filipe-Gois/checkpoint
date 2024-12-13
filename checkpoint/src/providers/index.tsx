"use client";
import React, { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AuthProvider from "./AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import AnimateProvider from "./AnimateProvider";
import TourProvider from "./TourProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>

      {children}

    </QueryProvider>
  );
};

export default Providers;
