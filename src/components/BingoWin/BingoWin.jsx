import { useSuperhero } from '@/hooks/useSuperhero';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import style from './BingoWin.module.css';
const gifList = [
    <>
   <iframe src="https://giphy.com/embed/cXblnKXr2BQOaYnTni" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/theoffice-the-office-tv-moroccan-christmas-cXblnKXr2BQOaYnTni">via GIPHY</a></p>
    </>,
    <>
    <iframe src="https://giphy.com/embed/3oFzmpzTfyABIX6JBm" width="480" height="444" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/teachersseries-tv-land-teacher-3oFzmpzTfyABIX6JBm">via GIPHY</a></p>
    </>,
    <>
    <iframe src="https://giphy.com/embed/ummeQH0c3jdm2o3Olp" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jason-clarke-curb-your-enthusiasm-bingo-larry-david-ummeQH0c3jdm2o3Olp">via GIPHY</a></p>
    </>,
    <>
   <iframe src="https://giphy.com/embed/U56VoSyFD8MFcie2k8" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/MXPlayerOfficial-good-correct-thatsaboutit-U56VoSyFD8MFcie2k8">via GIPHY</a></p>
    </>,
    <>
<iframe src="https://giphy.com/embed/U56VoSyFD8MFcie2k8" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/MXPlayerOfficial-good-correct-thatsaboutit-U56VoSyFD8MFcie2k8">via GIPHY</a></p>
    </>,
    <>
<iframe src="https://giphy.com/embed/DFu7j1d1AQbaE" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/stephen-django-djangostephen-DFu7j1d1AQbaE">via GIPHY</a></p>
    </>,
    <>
<iframe src="https://giphy.com/embed/gjZwGGfhw1zd3tBGok" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/hyperrpg-malikabdayhyperdrive-thats-a-bingo-daltonverse-gjZwGGfhw1zd3tBGok">via GIPHY</a></p>
    </>,
    <>
<iframe src="https://giphy.com/embed/gjZwGGfhw1zd3tBGok" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/hyperrpg-malikabdayhyperdrive-thats-a-bingo-daltonverse-gjZwGGfhw1zd3tBGok">via GIPHY</a></p>
    </>,
]

export const BingoWin = ({
    winnerBingo,
}) => {
    const { getSuperHeroById } = useSuperhero();
    const [gif, setGif] = useState();

    useEffect(() => {
        const randomGifList = gifList[Math.floor(Math.random() * gifList.length)];
        setGif(randomGifList); 
    }, [])
    
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
        {gif}
    </div>
    )
}
