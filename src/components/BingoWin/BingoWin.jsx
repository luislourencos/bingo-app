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

const gifLineList = [
    <>
   <iframe src="https://giphy.com/embed/nqi89GMgyT3va" width="428" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/nqi89GMgyT3va">via GIPHY</a></p>
        </>,  
    <>
  <iframe src="https://giphy.com/embed/o75ajIFH0QnQC3nCeD" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/theoffice-o75ajIFH0QnQC3nCeD">via GIPHY</a></p>
        </>,  
    <>
    <iframe src="https://giphy.com/embed/o75ajIFH0QnQC3nCeD" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/theoffice-o75ajIFH0QnQC3nCeD">via GIPHY</a></p>
        </>,  
    <>
   <iframe src="https://giphy.com/embed/ddHhhUBn25cuQ" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/ftw-coachs-ddHhhUBn25cuQ">via GIPHY</a></p>
        </>,  
    <>
   <iframe src="https://giphy.com/embed/5oGIdt1xapQ76" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/happy-excited-5oGIdt1xapQ76">via GIPHY</a></p>
        </>,  
    <>
   <iframe src="https://giphy.com/embed/uudzUtVcsLAoo" width="480" height="395" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/golf-success-tiger-woods-uudzUtVcsLAoo">via GIPHY</a></p>
        </>,  
    <>
   <iframe src="https://giphy.com/embed/vvbGMpbhZMcHSsD50w" width="480" height="361" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/reaction-vvbGMpbhZMcHSsD50w">via GIPHY</a></p>
        </>,  
    <>
   <iframe src="https://giphy.com/embed/3rUbeDiLFMtAOIBErf" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/win-argument-3rUbeDiLFMtAOIBErf">via GIPHY</a></p>
        </>,  
]

export const BingoWin = ({
    winnerBingo,
}) => {
    const { getSuperHeroById } = useSuperhero();
    const [gif, setGif] = useState();
    const [gifLine, setGifLine] = useState();

    useEffect(() => {
        const randomGifList = gifList[Math.floor(Math.random() * gifList.length)];
        const randomGifLineList = gifLineList[Math.floor(Math.random() * gifLineList.length)];
        setGif(randomGifList); 
        setGifLine(randomGifLineList);
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
        {winnerBingo?.line?gifLine:gif}
    </div>
    )
}
