import type { Metadata } from 'next'
import { lusitana } from '@/app/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s | Sprout9 Forms', default: 'Sprout9 Forms' },
  description: 'Created by ...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lusitana.className}>{children}</body>
    </html>
  )
}
