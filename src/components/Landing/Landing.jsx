"use client"

import { useSuperhero } from '@/hooks/SuperheroProvider';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Landing.module.css';

export default function Landing() {
  const { id } = useParams()
  const router = useRouter()
  const [room, setRoom] = useState(id ? decodeURIComponent(id) : '')
  const [name, setName] = useState('')
  const [selectSuperHero, setSelectSuperHero] = useState()
  const {superHeroImage} = useSuperhero()

  const addUserType = (e) => {
    if (!room) {
      alert('Introduce el id de la sala');
      return;
    }
    if (!/^[a-zA-Z0-9]{5}$/.test(room)) {
      alert('El id de la sala debe tener exactamente 5 caracteres (solo letras o números, sin espacios ni símbolos)');
      return;
    }
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
    if (name === 'admin6232') {
      router.push(`/${room}/admin`)
    } else {
      router.push(`/${room}/${name}/${selectSuperHero}`)
    }
  }

  const createRoom = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newRoom = '';
    for (let i = 0; i < 5; i++) {
      newRoom += chars[Math.floor(Math.random() * chars.length)];
    }
    router.push(`/${newRoom}/admin`)
  }

  return (
    <div className={styles.container}>
      <Image
        src="https://cataas.com/cat/gif/says/BINGO?position=center&font=Impact&fontSize=60&fontColor=%23fff&fontBackground=none"
        width={400}
        height={400}
        className={styles.bingoImg}
        unoptimized
        priority
        alt="BINGO"
      />
        <div className={styles.formContainer}>

        <input className={styles.input} type="text" placeholder="Id de la sala (5 caracteres)" maxLength={5} value={room} onChange={(e) => setRoom(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} />
        <input className={styles.input} type="text" placeholder="Introduce tu nombre y elige un gato" maxLength={10} value={name} onChange={(e) => setName(e.target.value)} />
          <div className={styles.avatarContainer}>
            {superHeroImage.length>0 && superHeroImage.map((item) => (
              <button key={item.id} onClick={() => setSelectSuperHero(item.id)} className={`${styles.avatar} ${selectSuperHero===item.id?styles.avatarSelected: ''}`}>
              <Image  src={item.image} width={80} height={80} alt="Picture of the author" />
            </button>
          ))}
          </div>
        <button className={styles.btn} onClick={addUserType}>Entrar a jugar</button>
        <button className={`${styles.btn} ${styles.btnCreate}`} onClick={createRoom}>Crear sala de bingo</button>
      </div>
    </div>
  );
}
