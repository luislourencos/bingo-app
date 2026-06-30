import { useEffect, useMemo, useState } from 'react';
import { getSocket } from '../../utils/socket';
import style from './Ranking.module.css';

export const Ranking = () => {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const socket = getSocket();
        const onRanking = (data) => setRanking(data);
        socket.on("ranking", onRanking);
        return () => socket.off("ranking", onRanking);
    }, []);

    // Copy before sorting to avoid mutating state in place.
    const newRanking = useMemo(
        () => [...ranking].sort((a, b) => b.price - a.price),
        [ranking]
    );

    return (
        <div className={style.list}>
            <h3 className={style.title}>Ranking</h3>
            <div>
                {newRanking.map((user, index) => {
                    return <div key={user.name ?? index} className={style.element}>
                        <p>{index + 1} - </p>
                        <p>{decodeURI(user.name) || '_ _ _ _'} </p>
                    </div>
                })}
            </div>
        </div>)
}
