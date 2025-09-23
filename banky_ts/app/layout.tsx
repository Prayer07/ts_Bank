'use client'

import { Toaster } from 'react-hot-toast'
import "./globals.css";
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <SessionProvider>
        <Toaster position="top-center" />
        {children}
        </SessionProvider>
      </body>
    </html>
  )
}
