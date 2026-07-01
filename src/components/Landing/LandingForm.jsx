"use client"

import Image from 'next/image';
import { useLandingForm } from '@/hooks/useLandingForm';
import styles from './Landing.module.css';

// Client Component: renders the interactive form. All the state and logic
// lives in the useLandingForm hook. The avatar list arrives already fetched
// from the server via props.
export default function LandingForm({ superHeroImage = [] }) {
  const {
    room,
    name,
    selectedAvatar,
    setSelectedAvatar,
    onRoomChange,
    onNameChange,
    enterGame,
    createRoom,
  } = useLandingForm();

  return (
    <div className={styles.formContainer}>
      <input className={styles.input} type="text" placeholder="Id de la sala (5 caracteres)" maxLength={5} value={room} onChange={onRoomChange} />
      <input className={styles.input} type="text" placeholder="Pon tu nombre y elige un gato" maxLength={10} value={name} onChange={onNameChange} />
      <div className={styles.avatarContainer}>
        {superHeroImage.length > 0 && superHeroImage.map((item) => (
          <button key={item.id} onClick={() => setSelectedAvatar(item.id)} className={`${styles.avatar} ${selectedAvatar === item.id ? styles.avatarSelected : ''}`}>
            <Image src={item.image} width={80} height={80} alt="Avatar" />
          </button>
        ))}
      </div>
      <button className={styles.btn} onClick={enterGame}>Entrar a jugar</button>
      <button className={`${styles.btn} ${styles.btnCreate}`} onClick={createRoom}>Crear sala de bingo</button>
    </div>
  );
}
