
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
        src="https://i.ibb.co/YPGc9D3/casino3.jpg"
        width={500}
        height={500}
        className={styles.image}
        alt="Picture of the author"
        />
        
          {children}
        
    <footer className={styles.footer}>
          <div>

        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" viewBox="0 0 192.756 192.756"><g><path fill="#0099f7" d="M0 0h192.756v192.756H0V0z"/><path fill="#cc2229" d="M8.504 64.146l84.767 102.077 90.981-102.077-32.133-33.553-109.887-.177-33.728 33.73z"/><path d="M23.247 64.751l22.442-23.193 14.099.175c-21.772 10.526-27.047 24.816-23.45 37.835L23.247 64.751zm49.641 59.696c17.431 4.777 28.188 5.562 43.69.805l-22.32 23.393-21.37-24.198zM43.32 90.93l18.194 20.433c2.764-10.703 31.508-4.162 34.03 4.604 12.047 3.963 32.579-2.783 32.866-9.064-.056-15.152-70.028-2.579-85.09-15.973zm107.467-45.619l-.488 21.614h-28.34c.383-14.29-10.477-21.309-31.385-20.733-14.722.288-28.868 6.042-29.06 15.537 0 22.539 79.269-1.822 85.599 29.636l22.988-26.584-19.314-19.47zm-33.711-3.499l15.035.018-3.295 11.19c-2.771-6.774-7.435-9.247-11.74-11.208z" fill="#fff22d"/></g></svg>
          </div>
          <h2>
          Supermarkets
          </h2>
     
    </footer>
      </body>
    </html>
  )
}
