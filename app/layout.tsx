import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { Toaster } from "react-hot-toast";
import "react-responsive-modal/styles.css";
import "flatpickr/dist/themes/airbnb.css";

// Load Inter with all variants
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Edulife IT School | Admin Panel",
  description: "Control Panel for Edulife IT School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientProviders>
          {children}
          <Toaster position="bottom-center" />
        </ClientProviders>
      </body>
    </html>
  );
}
