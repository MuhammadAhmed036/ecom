import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce Store - Premium Fashion & Accessories',
  description: 'Discover the latest trends in fashion and accessories. Shop for men\'s and women\'s clothing, accessories, and more.',
  keywords: 'e-commerce, fashion, clothing, accessories, men, women, shopping',
  authors: [{ name: 'E-Commerce Store' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
