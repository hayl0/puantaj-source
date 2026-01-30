import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </>
  )
}
