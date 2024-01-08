import Image from 'next/image';
import { useEffect, useState } from 'react';
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

    return (<div className={style.list}>
        {
            ranking?.map((user, index) => {
                return <div key={index} className={style.element}  style={{color:user.completed>=77?'rgb(6, 236, 6)': user.completed>=50?'rgb(33, 200, 255)': 'black'}} >
                    <p>{index +1} - </p>
                    <Image  src={`/${user.superHeroImage}.png`} width={40} height={40} className={style.avatar} alt="Picture of the author" />
                    <p>{user.name} - </p>
                    <p>{`${user.money}€`}</p>  
                </div>
            })}
    </div>)
    
}