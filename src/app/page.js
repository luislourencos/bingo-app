"use client"

import { useSuperhero } from '@/hooks/useSuperhero';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectSuperHero, setSelectSuperHero] = useState()
  const superHeroImage = useSuperhero()

  const addUserType = (e) => {
    if (selectSuperHero && !!name) {
     if (name === 'admin') {
        router.push('/admin')  
     } else {
       router.push(`/${name}/${selectSuperHero}`)
      }
    }
  }
  
  return (
    <div className={styles.container}>
      <h1 data-shadow='BINGO'>BINGO </h1>
      <h1 data-shadow='Supermarkets'>Supermarkets</h1>
      
        <div className={styles.formContainer}>
          <label className={styles.label}>Para entrar al Bingo introduce tu nombre y elige un avatar</label>
        <input className={styles.input} type="text" placeholder="User" onChange={(e) => setName(e.target.value)} />
          <div className={styles.avatarContainer}>
            {superHeroImage.length>0 && superHeroImage.map((item) => (
              <button key={item.id} onClick={() => setSelectSuperHero(item.id)} className={`${styles.avatar} ${selectSuperHero===item.id?styles.avatarSelected: ''}`}>
              <Image  src={item.image} width={70} height={70} alt="Picture of the author" />
            </button>
          ))}
          </div>
        <button className={styles.btn} onClick={addUserType}>OK</button>
      </div>
    </div>
  );
}
