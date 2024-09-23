"use client";
import "~/styles/globals.css";
import { SessionProvider } from 'next-auth/react';
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <title>DuyThinhTBlogging</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
