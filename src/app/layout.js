import { Inter } from 'next/font/google'
import './globals.css'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bingo supermarkets'
}

import Image from 'next/image'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
      <Image
        src="/casino.jpg"
        width={500}
        height={500}
        className={styles.image}
        alt="Picture of the author"
        />
        {children}
        <footer className={styles.footer}>
        Supermarkets
    </footer>
      </body>
    </html>
  )
}
