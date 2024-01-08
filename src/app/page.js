"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectSuperHero, setSelectSuperHero]= useState()

  const addUserType = (e) => {
    if (selectSuperHero && !!name) {
     if (name === 'admin') {
        router.push('/admin')  
     } else {
       router.push(`/${name}/${selectSuperHero}`)
      }
    }
  }

const list=[1,2,3,4,5,6,7,8,9]

  // SUPERHEROES
  // Enigma
  // Thanos
  // Volverine
  // Robin
  // Balck panther
  // Gamora
  // Groot
  return (
    <div className={styles.container}>
      <h1 data-shadow='BINGO'>BINGO </h1>
      <h1 data-shadow='Supermarkets'>Supermarkets</h1>
      
        <div className={styles.formContainer}>
          <label className={styles.label}>Para entrar al Bingo introduce tu nombre y elige un avatar</label>
          <input className={styles.input} type="text" placeholder="User" onChange={(e) => setName(e.target.value)} />
          <div className={styles.avatarContainer}>
            {list.map((item) => (
              <button key={item} onClick={() => setSelectSuperHero(`superheroe${item}`)} className={`${styles.avatar} ${selectSuperHero===`superheroe${item}`?styles.avatarSelected: ''}`}>
              <Image  src={`/superheroe${item}.png`} width={50} height={50} alt="Picture of the author" />
            </button>
          ))}
          </div>
        <button className={styles.btn} onClick={addUserType}>OK</button>
      </div>
    </div>
  );
}
