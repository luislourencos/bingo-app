import Image from 'next/image';
import { useMemo } from 'react';
import { useSuperhero } from '../../hooks/SuperheroProvider';
import { LINE_GIFS, WIN_GIFS } from '../../utils/constants';
import style from './BingoWin.module.css';

export const BingoWin = ({ winnerBingo }) => {
    const { getSuperHeroById } = useSuperhero();

    // Pick a celebration gif once per mount. A given overlay is either a line
    // win or a full bingo, so the list never changes during its lifetime.
    const gif = useMemo(() => {
        const list = winnerBingo.line ? LINE_GIFS : WIN_GIFS;
        return list[Math.floor(Math.random() * list.length)];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const image = getSuperHeroById(winnerBingo.superHeroImage);

    return (
        <div className={style.container}>
            <div className={style.pyro}>
                <div className={style.before} />
                <div className={style.after} />
            </div>
            <div className={style.winnerBox}>
                <Image src={image} width={60} height={70} className={style.avatar} alt="Picture of the author" />
                <h1>{winnerBingo?.line ? 'Linea' : 'BINGO'}</h1>
            </div>
            {gif && (
                <iframe
                    src={gif.src}
                    width={gif.width}
                    height={gif.height}
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
                />
            )}
        </div>
    );
};
