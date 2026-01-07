import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Učitel - Revizní Technik Elektro',
  description: 'Interaktivní AI učitel pro přípravu na zkoušku revizního technika',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
