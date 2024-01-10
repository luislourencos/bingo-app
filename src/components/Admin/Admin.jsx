"use client"

import { useEffect, useMemo, useState } from "react";
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';
import style from './Admin.module.css';

export const Admin = () => { 
    const [listRandomNumber, setListRandomNumber] = useState([]);
    const [userList, setUserList] = useState([])
    const [cardPrice, setCardPrice] = useState(0);
    const [ranking, setRanking] = useState([]);
    console.log('ranking',ranking);
    useEffect(() => {
        const rankingStorage = JSON.parse(localStorage.getItem('ranking'));
        const updatedRanking = rankingStorage || [];
        setRanking(updatedRanking);
        const socket = socketIOClient(URL);
        socket.emit('ranking', updatedRanking);
        socket.emit('priceCard', cardPrice);
        return () => socket.disconnect();
    }, [userList.length]);

    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("userList", data => {
            setUserList(data);
        });
        return () => socket.disconnect();
    }, [])

    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("winnerBingo", data => {
            debugger
            const rankingStorage = JSON.parse(localStorage.getItem('ranking'));
            const updatedRanking = rankingStorage || [];
            const user = updatedRanking.filter((user) => user?.name === data.name);
           
            if (user.length > 0) {
                const newRanking = updatedRanking.map((user) => {
                    if (user.name === data.name) {
                        user.price = user.price + data.price;
                        return user;
                    }
                    return user;
                })

                setRanking(newRanking);
                localStorage.setItem('ranking', JSON.stringify(newRanking));
                socket.emit('ranking', newRanking);
            } else {
                setRanking([...updatedRanking, data])
                localStorage.setItem('ranking', JSON.stringify([...updatedRanking, data]));
                socket.emit('ranking', [...updatedRanking, data]);
            }  
        });
        return () => socket.disconnect();
    }, []);
    
    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("winnerFirstLine", data => {
          localStorage.setItem('ranking', JSON.stringify(data));
        });
        return () => socket.disconnect();
    }, []);
    
    const randomNumber = () => {
        const random = Math.floor(Math.random() * 60) + 1;
        const socket = socketIOClient(URL);
        if (listRandomNumber.length < 60) {
            if (listRandomNumber.includes(random)) {
                randomNumber();
            } else {
                setListRandomNumber([...listRandomNumber, random]);
                socket.emit('randomNumbers', { numbers: [...listRandomNumber, random], user: 'admin' });
            }
        } else {
            alert('All numbers are out');
        }
    }    

    const restart = () => {
        setListRandomNumber([]);
        const socket = socketIOClient(URL);
        socket.emit('restart');
    }
    const resetAll = () => {
        setRanking([]);
        localStorage.setItem('ranking', JSON.stringify([]));
        const socket = socketIOClient(URL);
        socket.emit('restart');
    }
    
    const postPrice = () => {
        const socket = socketIOClient(URL);
        socket.emit('priceCard', cardPrice);
    }
    
    const newRanking =  useMemo(()=>ranking.sort((a, b) => {
        return b.price - a.price;
    }), [ranking])
    
    return (
        <div className={style.container}>
            {JSON.stringify(ranking)}
            <h3>Precio por cartón</h3>
            <input type="number" value={cardPrice} onChange={(e) => setCardPrice(e.target.value)} />
            <div>
            <h3>Ranking</h3>
            <div className={style.list}>
                {
                   newRanking.length>0 && newRanking.map((user, index) => {
                       console.log(user);
                        return <div key={index} className={style.element} >
                            <p>{index + 1} - </p>
                            <p>{user?.name || '_ _ _ _'} - </p>
                            <p>{`${user?.price?.toFixed(2)}€`}</p>
                        </div>
                    })}
            </div>
            </div>
            <button className={style.btn} onClick={postPrice}>Asignar Precio</button>
            <div className={style.buttonsContainer}>
                <button className={style.btn} onClick={restart}>Restart</button>
                <button className={style.btn} onClick={resetAll}>Reset All</button>
                <button className={style.btn} onClick={randomNumber}>Random Number</button>
            </div>
            <h2>Targetas de los usuarios</h2>
            <div className={style.userList}>
                
            {userList?.map((user, index) => {
                return <div key={index} className={style.cardContainer}>
                    <h3>{user.name}</h3>
                    <table className={style.table} >
                        <tbody>{
                            user.card?.map((line, indexColumn) => {
                                return <tr key={indexColumn}>
                                    {line.map((element) => {
                                        return <td key={element.number} className={style.td}>
                                            <div className={`${style.buttonNumber} ${element.matched ? style.matched : ''}`} >
                                                {element.number}
                                            </div>
                                        </td>
                                    })}
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            })
        }
</div>

        <div className={style.numberList}>
        {listRandomNumber.map((number, index) => {
            return <div className={`${style.numbers} ${listRandomNumber.length-1===index? style.lastNumber:''}`} key={index}>{number}</div>
        })}
        </div>
    </div>
    )
}   

