"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSocket } from "../../utils/socket";
import { Ranking } from "../Ranking/Ranking";
import style from './Admin.module.css';

export const Admin = () => {
    const router = useRouter();
    const [listRandomNumber, setListRandomNumber] = useState([]);
    const [userList, setUserList] = useState([]);
    const [cardPrice, setCardPrice] = useState(0.15);

    // Register all listeners once on a single shared connection.
    useEffect(() => {
        const socket = getSocket();
        socket.emit("userEnter");

        const handleUserList = (data) => setUserList(data);
        const handleWinnerFirstLine = (data) =>
            localStorage.setItem('ranking', JSON.stringify(data));

        socket.on("userList", handleUserList);
        socket.on("winnerFirstLine", handleWinnerFirstLine);

        return () => {
            socket.off("userList", handleUserList);
            socket.off("winnerFirstLine", handleWinnerFirstLine);
        };
    }, []);

    // Notify the price whenever it changes.
    useEffect(() => {
        getSocket().emit('priceCard', cardPrice);
    }, [cardPrice]);

    const randomNumber = () => {
        if (listRandomNumber.length >= 50) {
            alert('All numbers are out');
            return;
        }
        let random;
        do {
            random = Math.floor(Math.random() * 50) + 1;
        } while (listRandomNumber.includes(random));

        const numbers = [...listRandomNumber, random];
        setListRandomNumber(numbers);
        getSocket().emit('randomNumbers', { numbers, user: 'admin' });
    };

    const restart = () => {
        setListRandomNumber([]);
        getSocket().emit('restart');
    };

    const resetAll = () => {
        getSocket().emit('resetAll');
    };

    return (
        <div className={style.container}>

            <div className={style.header}>
                <button className={style.buttonReturn} onClick={() => router.push('/')}>{'<'}</button>
                <p className={style.headerTitle}>BINGO</p>
                <span className={style.headerSpacer} />
            </div>

            <div className={style.topRow}>
                <div className={style.rankingWrap}>
                    <Ranking />
                </div>

                <div className={style.buttonsContainer}>
                    <button className={style.btn} onClick={restart}>Restart</button>
                    <button className={style.btn} onClick={resetAll}>Reset All</button>
                    <button className={style.btn} onClick={randomNumber}>Random</button>
                </div>
            </div>
              {listRandomNumber.length > 0 && (
            <div className={`${style.numbers} ${style.lastNumber}`}>
                {listRandomNumber[listRandomNumber.length - 1]}
            </div>
        )}
        <div className={style.numberList}>
        {listRandomNumber.map((number) => {
            return <div className={`${style.numbers} ${style.smallNumber}`} key={number}>{number}</div>
        })}
        </div>
            <h4>Targetas de los usuarios</h4>
            <div className={style.userList}>

            {userList?.map((user, index) => {
                return <div key={user.name ?? index} className={style.cardContainer}>
                    <h5>{user.name}</h5>
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


    </div>
    )
}
