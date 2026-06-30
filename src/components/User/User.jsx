import { useSuperhero } from '@/hooks/SuperheroProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { URL } from '../../utils/constants';
import { getSocket } from '../../utils/socket';
import { BingoWin } from '../BingoWin/BingoWin';
import { Loading } from '../Loading/Loading';
import { Ranking } from '../Ranking/Ranking';
import { UserList } from '../UserList/UserList';
import styles from './User.module.css';

export const User = ({ name, superHeroImage }) => {
    const { getSuperHeroById } = useSuperhero();
    const [priceCard, setPriceCard] = useState(0);
    const [userList, setUserList] = useState([])
    const linePrice = userList.length*(priceCard/3)
    const bingoPrice = userList.length*priceCard - linePrice;
    const router = useRouter();
    const [card, setCard] = useState([]);
    const [isLoading, setISLoading] = useState(true);
    const [winnerFirstLine, setWinnerFirstLine] = useState({line: false , name: '', price: linePrice});
    const [winnerBingo, setWinnerBingo] = useState({ bingo: false, name: '', price: bingoPrice });
    const [showWinnerBingo, setShowWinnerBingo] = useState(true);
    const [showWinnerLine, setShowWinnerLine] = useState(true);
    const [listRandomNumber, setListRandomNumber] = useState([]);

    useEffect(() => {
        if (winnerBingo.bingo) {
            const timer = setTimeout(() => setShowWinnerBingo(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [winnerBingo]);

    useEffect(() => {
        if (winnerFirstLine.line) {
            const timer = setTimeout(() => setShowWinnerLine(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [winnerFirstLine]);

    const getCard = () => {
        fetch(`${URL}/api/getCard`)
            .then((response) => response.json())
            .then((data) => setCard(data));
    };

    // Single shared connection + all listeners registered once.
    useEffect(() => {
        const socket = getSocket();
        socket.emit("userEnter");

        const onWinnerFirstLine = (data) => setWinnerFirstLine(data);
        const onPriceCard = (data) => setPriceCard(data);
        const onWinnerBingo = (data) => setWinnerBingo(data);
        const onRandomNumbers = (data) => setListRandomNumber(data.numbers);
        const onUserList = (data) =>
            setUserList(data.map((user) => ({ ...user, name: decodeURI(user.name) })));
        const onRestart = () => getCard();
        const onResetAll = () => router.push('/');

        socket.on("winnerFirstLine", onWinnerFirstLine);
        socket.on("priceCard", onPriceCard);
        socket.on("winnerBingo", onWinnerBingo);
        socket.on("randomNumbers", onRandomNumbers);
        socket.on("userList", onUserList);
        socket.on("restart", onRestart);
        socket.on("resetAll", onResetAll);

        return () => {
            socket.off("winnerFirstLine", onWinnerFirstLine);
            socket.off("priceCard", onPriceCard);
            socket.off("winnerBingo", onWinnerBingo);
            socket.off("randomNumbers", onRandomNumbers);
            socket.off("userList", onUserList);
            socket.off("restart", onRestart);
            socket.off("resetAll", onResetAll);
        };
    }, []);

    useEffect(() => {
        getSocket().emit("user", { name, card, superHeroImage });
    }, [card]);

    useEffect(() => {
        getCard();
    }, []);

    useEffect(() => {
        if (card.length > 0) {
            setISLoading(false);
        }
    }, [card]);

    const selectNumber = ({ column, line }) => {
        const number = card[column][line].number;
        if (!listRandomNumber.includes(number)) return;

        const newCard = card.map((row, c) =>
            c === column
                ? row.map((cell, l) => (l === line ? { ...cell, matched: true } : cell))
                : row
        );
        setCard(newCard);
        checkFirstLine(newCard);
        checkBingo(newCard);
    };

    const checkBingo = (currentCard) => {
        if (winnerBingo.bingo) return;
        const bingo = currentCard.every((line) => line.every((element) => element.matched));
        if (bingo) {
            const winBingo = { bingo: true, name, price: bingoPrice, superHeroImage };
            setWinnerBingo(winBingo);
            setShowWinnerBingo(true);
            getSocket().emit('winnerBingo', winBingo);
        }
    };

    const checkFirstLine = (currentCard) => {
        if (winnerFirstLine.line) return;
        const hasLine = currentCard.some((line) => line.every((element) => element.matched));
        if (hasLine) {
            const winLine = { line: true, name, price: linePrice, superHeroImage };
            getSocket().emit('winnerFirstLine', winLine);
            setWinnerFirstLine(winLine);
            setShowWinnerLine(true);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.containerLoading}>
                <Loading />
            </div>)
    }

    const returnMain = () => {
        getSocket().emit('removeUser', { name });
        router.push('/');
    };

    return (
      <div className={styles.container}>
        {winnerBingo.bingo && showWinnerBingo && <BingoWin winnerBingo={winnerBingo} />}
        {winnerFirstLine.line && showWinnerLine && <BingoWin winnerBingo={winnerFirstLine} />}
        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.buttonReturn} onClick={returnMain}>{'<'}</button>
          <p className={styles.userInfo}>
        BINGO
          </p>
        <div className={styles.userInfo}>
          <Image  src={getSuperHeroById(superHeroImage)} width={60} height={70} className={styles.avatar}alt="Picture of the author" />
          <p >{decodeURI(name)}</p>
          </div>
        </div>
   
        {/* HEADER */}

        {/* INFO */}
          <div className={styles.infoGame}>
            <UserList getSuperHeroById={getSuperHeroById} userList={userList.filter(user => user.name !== name)} winnerFirstLine={winnerFirstLine} winnerBingo={winnerBingo} />
            <Ranking />
          </div>
      <div className={styles.numberContainer}>
            {listRandomNumber.length > 0 && <div className={styles.randomNumber}>{listRandomNumber[listRandomNumber.length - 1]}</div>}
      <table className={styles.table} >
        <tbody>{
        card.map((line, indexColumn) => {
        return <tr key={indexColumn}>
          {line.map((element, indexLine) => {
            return <td key={element.number} className={styles}>
              <button className={`${styles.buttonNumber} ${element.matched?styles.matched:''}`} onClick={()=>selectNumber({column:indexColumn, line: indexLine})}>
                {element.number}
              </button>
            </td>
          })}
        </tr>
        })
    }
      </tbody>
          </table>
          </div>
    </div>)
}
