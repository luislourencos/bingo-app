import { useSuperhero } from '@/hooks/SuperheroProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';
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
    if(winnerBingo.bingo){
      setTimeout(() => {
        setShowWinnerBingo(false);
      }, 10000);
    }
  }, [winnerBingo]);

  useEffect(() => {
    if (winnerFirstLine.line) {
      setTimeout(() => {
        setShowWinnerLine(false);
      }, 5000);
    }
  }, [winnerFirstLine]);
  
  useEffect(() => {
    const socket = socketIOClient(URL);
    socket.on("winnerFirstLine", data => {
      console.log('ENTER')
      setWinnerFirstLine(data);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const socket = socketIOClient(URL);
    socket.emit("userEnter")
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const socket = socketIOClient(URL);
    socket.on("priceCard", data => {
      setPriceCard(data);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const socket = socketIOClient(URL);
    socket.on("winnerBingo", data => {
      setWinnerBingo(data);
    });
    return () => socket.disconnect();
  }, []);

    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("randomNumbers", data => {
            setListRandomNumber(data.numbers);
        });
   
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        const socket = socketIOClient(URL);
      socket.on("userList", data => {
        const decodeData = data.map((user) => ({ ...user, name: decodeURI(user.name) }))
          setUserList(decodeData);
        });
        return () => socket.disconnect();
    }, [])
  
    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("restart", data => {
          getCard();
        });
        return () => socket.disconnect();
    }, [])
    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.on("resetAll", data => {
          router.push('/');
        });
        return () => socket.disconnect();
    }, [])
  
    useEffect(() => {
        const socket = socketIOClient(URL);
        socket.emit("user", {name, card, superHeroImage});
        return () => socket.disconnect();
    },[card])
    


    const getCard = () => {
        fetch(`${URL}/api/getCard`).then((response) => {
          return response.json();
        }).then((data) => {
          setCard(data);
        })
    }
    useEffect(() => {
        getCard();
    }, []);

    useEffect(() => {
        if (card.length > 0) {
          setISLoading(false);
        }
    }, [card]);
  

  const selectNumber = ({ column, line }) => {

    const newCard = [...card];
    const number = newCard[column][line].number;
    const index = listRandomNumber.indexOf(number);
    if (index !== -1) {
      newCard[column][line].matched = true;
      setCard(newCard);
      checkFirstLine();
      checkBingo();
    }
  }
  
  
  const checkBingo = () => {  
    if (!winnerBingo.bingo) {
      const bingo = card.every((line) => {
        return line.every((element) => element.matched);
      });
      if (bingo) {
        const winBingo = { bingo: true, name, price: bingoPrice, superHeroImage };
        setWinnerBingo(winBingo);
        setShowWinnerBingo(true);
        const socket = socketIOClient(URL);
        socket.emit('winnerBingo', winBingo);
      }
    }
  }

  const checkFirstLine = () => {
    if (!winnerFirstLine.line) {
      for (let i = 0; i < card.length; i++) {
        const line = card[i];
        const lineMatched = line.every((element) => element.matched);
        if (lineMatched) {
          const winLine = { line: true, name, price: linePrice, superHeroImage };
          const socket = socketIOClient(URL);
          socket.emit('winnerFirstLine', winLine);
          setWinnerFirstLine(winLine);
          setShowWinnerLine(true);
          break;
        }
      }
    }
  }
    
  if (isLoading) {
    return (
      <div className={styles.containerLoading}>
         <Loading />
      </div>)
    }

  const returnMain = () => {
    const socket = socketIOClient(URL);
    socket.emit('removeUser', { name });
    router.push('/');
  }

    return (
      <div className={styles.container}>
        {winnerBingo.bingo && showWinnerBingo && <BingoWin winnerBingo={winnerBingo} />}
        {winnerFirstLine.line && showWinnerLine && <BingoWin winnerBingo={winnerFirstLine} />}
        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.buttonReturn} onClick={returnMain}>{'<'}</button>
          <h4 className={styles.infoCard}>{`Linea: ${linePrice.toFixed(2)}€`}</h4>
          <h4 className={styles.infoCard}>{`Bingo: ${bingoPrice.toFixed(2)}€`}</h4>
          <h4 className={styles.infoCard}>{`P/cartón: ${priceCard}€`}</h4>
        <div className={styles.userInfo}>
          <Image  src={getSuperHeroById(superHeroImage)} width={60} height={70} className={styles.avatar}alt="Picture of the author" />
          <p className={styles.userName}>{decodeURI(name)}</p>
          </div>
        </div>
        {/* HEADER */}
    
        {/* INFO */}
          <div className={styles.infoGame}>
            <UserList getSuperHeroById={getSuperHeroById} userList={userList.filter(user => user.name !== name)} winnerFirstLine={winnerFirstLine} winnerBingo={winnerBingo} />
            <Ranking />
          </div>
        <div>
       
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

