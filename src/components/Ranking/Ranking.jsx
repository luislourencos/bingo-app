import { useEffect, useMemo, useState } from 'react';
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';
import style from './Ranking.module.css';

export const Ranking = () => {
    const  [ranking, setRanking] = useState([]);

    // order userList by completed
    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("ranking", data => {
            setRanking(data);
        });
        return () => socket.disconnect();
    }, [])

    const newRanking =  useMemo(()=>ranking.sort((a, b) => {
        return b.price - a.price;
    }), [ranking])
    
    return (
        <div className={style.list}>
            <h3 className={style.title}>Ranking</h3>
            {newRanking && <div>
                {
                    newRanking?.map((user, index) => {
                        return <div key={index} className={style.element}>
                            <p>{index + 1} - </p>
                            <p>{decodeURI(user.name) || '_ _ _ _'} - </p>
                            <p>{`${user.price.toFixed(2)}€`}</p>
                        </div>
                    })}
            </div>}
         </div>)
            
    
}