"use client"

import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';
import style from './Admin.module.css';

export const Admin = () => { 
    const [listRandomNumber, setListRandomNumber] = useState([]);
    const [userList, setUserList] = useState([])


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
          //TODO save in local storage and show in ranking
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
    const card= undefined
    return (
        <div className={style.container}>
            <div className={style.buttonsContainer}>
                <button className={style.btn} onClick={restart}>Restart</button>
                <button className={style.btn} onClick={restart}>Reset All</button>
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

