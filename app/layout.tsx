import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Flowify", description: "A personal Spotify listening space" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
