import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VJ CLUB - Premium Sports Gear',
  description: 'Premium sneakers, shirts, and cleats for the modern athlete',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
