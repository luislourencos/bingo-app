
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
        src="https://img.magnific.com/free-photo/beautiful-domestic-cat-laying-fence_181624-43207.jpg?t=st=1782833538~exp=1782837138~hmac=865cbffc4e0e775f6e2ec91b34743883a1c96a6021411e661246bb7cbf0eeaa6&w=740"
        width={800}
        height={800}
        className={styles.image}
        alt="Picture of the author"
        />
        
          {children}
        
    <footer className={styles.footer}>
          <span className={styles.brand}>MANGO</span>
    </footer>
      </body>
    </html>
  )
}
