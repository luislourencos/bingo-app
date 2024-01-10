import { useSuperhero } from '@/hooks/useSuperhero';
import Image from 'next/image';
import style from './BingoWin.module.css';
const gifList = [
    <>
    <iframe src="https://giphy.com/embed/3oFzlUq9gpFanxX1f2" width="300" height="300" allowFullScreen></iframe>
    </>,
    <>
    <iframe src="https://giphy.com/embed/DFu7j1d1AQbaE" width="300" height="300" allowFullScreen></iframe>
    </>,
    <>
    <iframe src="https://giphy.com/embed/3oFzmpzTfyABIX6JBm" width="300" height="300" allowFullScreen></iframe>
    </>,
    <>
    <iframe src="https://giphy.com/embed/ummeQH0c3jdm2o3Olp" width="300" height="300" allowFullScreen></iframe>
    </>,
    <>
   <iframe src="https://giphy.com/embed/U56VoSyFD8MFcie2k8" width="300" height="300" allowFullScreen></iframe>
    </>,
]

export const BingoWin = ({
    winnerBingo,
}) => {
    const { getSuperHeroById } = useSuperhero();
    const randomGifList = gifList[Math.floor(Math.random() * gifList.length)];
    const image = getSuperHeroById(winnerBingo.superHeroImage)
    return (
    <div className={style.container}>
        <div className={style.pyro}>
            <div className={style.before}/>
            <div className={style.after}/>      
            </div>
            <div className={style.winnerBox}>
            <Image  src={image} width={60} height={70} className={style.avatar}alt="Picture of the author" />
                <h1>{winnerBingo?.line?'Linea':'BINGO'}</h1>
            </div>
            {randomGifList}
    </div>
    )
}
