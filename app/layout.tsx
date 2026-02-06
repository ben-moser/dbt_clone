import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Sidebar } from "@/components/layout/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "dbt Cloud",
  description: "dbt Cloud UI Clone",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <main className="ml-60 min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
