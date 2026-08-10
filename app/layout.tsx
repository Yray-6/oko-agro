import type { Metadata } from "next";
import { Urbanist } from 'next/font/google'
import "./globals.css";
import ToastContainer from "./components/ToastContainer";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-urbanist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Òkó Agro",
  description:
    "Agricultural marketplace connecting farmers and processors — list produce, manage orders, and ensure quality from farm to factory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>
      <body
        className="font-urbanist"
        style={{
          fontFamily: "Urbanist, sans-serif",
        }}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
