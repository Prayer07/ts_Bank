'use client'

import { Toaster } from 'react-hot-toast'
import "./globals.css";
import Script from 'next/script';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  )
}
