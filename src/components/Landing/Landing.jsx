"use client"

import { useSuperhero } from '@/hooks/SuperheroProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Landing.module.css';

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectSuperHero, setSelectSuperHero] = useState()
  const {superHeroImage} = useSuperhero()

  const addUserType = (e) => {
    if (name.length > 10) {
      alert('El nombre no puede tener más de 10 caracteres');
      return;
    }
    if (!selectSuperHero) {
      alert('Debes seleccionar un avatar');
      return;
    }
    if (!name) {
      return;
    }
    if (name === 'admin') {
      router.push('/admin')
    } else {
      router.push(`/${name}/${selectSuperHero}`)
    }
  }
  
  return (
    <div className={styles.container}>
      <h1 data-shadow='BINGO'>BINGO</h1>
        <div className={styles.formContainer}>
        <input className={styles.input} type="text" placeholder="User" maxLength={10} value={name} onChange={(e) => setName(e.target.value)} />
          <div className={styles.avatarContainer}>
            {superHeroImage.length>0 && superHeroImage.map((item) => (
              <button key={item.id} onClick={() => setSelectSuperHero(item.id)} className={`${styles.avatar} ${selectSuperHero===item.id?styles.avatarSelected: ''}`}>
              <Image  src={item.image} width={80} height={80} alt="Picture of the author" />
            </button>
          ))}
          </div>
        <button className={styles.btn} onClick={addUserType}>OK</button>
      </div>
    </div>
  );
}
