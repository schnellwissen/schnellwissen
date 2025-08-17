import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SchnellWissen - Deine Quelle für interessante Artikel',
  description: 'Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}