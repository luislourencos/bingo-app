import Image from 'next/image';
import LandingForm from './LandingForm';
import styles from './Landing.module.css';

// Server Component: renders the static shell (BINGO image + layout) and hands
// the interactive form off to a client component. The avatars and the BINGO
// gif are fetched on the server and passed down as props.
export default function Landing({ superHeroImage = [], bingoGif }) {
  return (
    <div className={styles.container}>
      <Image
        src={bingoGif}
        width={400}
        height={400}
        className={styles.bingoImg}
        unoptimized
        priority
        alt="BINGO"
      />
      <LandingForm superHeroImage={superHeroImage} />
    </div>
  );
}
