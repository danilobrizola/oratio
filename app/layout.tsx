import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import Header from './components/Header'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
