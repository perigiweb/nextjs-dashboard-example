import type { Metadata } from 'next'

import Link from 'next/link'

import '@/style/global.css';
import { inter, jost } from './font'

export const metadata: Metadata = {
  title: 'Next Dashboard Example',
  description: 'Next JS charts example.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable}`}>
      <body className="font-sans bg-slate-200 dark:bg-slate-800">
		    <header className="px-4 py-3 bg-slate-300 dark:bg-slate-700"><Link className="font-jost font-bold text-lg" href="/">{metadata.title as string}</Link></header>
		    <main className="w-full px-4 py-6 md:py-8">{children}</main>
        <footer className="border-t border-slate-400 dark:border-slate-600 p-4">
          <p className="text-center">&copy; 2025 by <a href="https://perigi.my.id" target="_blank" className="underline decoration-orange-600 hover:text-orange-700/90">Perigi Web</a></p>
        </footer>
	    </body>
    </html>
  )
}
