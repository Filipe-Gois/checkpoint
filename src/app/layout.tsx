import type { Metadata } from "next";
import { Poppins, DM_Sans } from "@next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "CheckPoint",
  description: "CheckPoint",
  openGraph: {
    title: "CheckPoint",
    description: "CheckPoint",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true
    }

  }
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning lang="pt-br">
      <body className={`${poppins.variable} ${dmSans.variable} antialiased bg-[#F4F4F4] outline-none`}>
        <Providers>
          <Sidebar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
