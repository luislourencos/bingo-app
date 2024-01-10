import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';
import { Loading } from '../Loading/Loading';
import { Ranking } from '../Ranking/Ranking';
import { UserList } from '../UserList/UserList';
import styles from './User.module.css';

export const User = ({ name, superHeroImage }) => {
  const [priceCard, setPriceCard] = useState(0);
    const [userList, setUserList] = useState([])
    const linePrice = userList.length*(priceCard/3)
    const bingoPrice = userList.length*priceCard - linePrice;
    const router = useRouter();
    const [card, setCard] = useState([]);
    const [isLoading, setISLoading] = useState(true);
    const [winnerFirstLine, setWinnerFirstLine] = useState({line: false , name: '', price: linePrice});
    const [winnerBingo, setWinnerBingo] = useState({bingo: false , name: '', price: bingoPrice});
    const [listRandomNumber, setListRandomNumber] = useState([]);
  
  useEffect(() => {
    const socket = socketIOClient(URL);
    socket.on("winnerFirstLine", data => {
      setWinnerFirstLine(data);
    });
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
            setUserList(data);
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
      newCard[column][line].matched = true;
        setCard(newCard);
      checkFirstLine();
      checkBingo();
    }
  
  
  const checkBingo = () => {  
    if (!winnerBingo.bingo) {
      const bingo = card.every((line) => {
        return line.every((element) => element.matched);
      });
      if (bingo) {
        const winBingo = { bingo: true, name, price: bingoPrice };
        setWinnerBingo(winBingo);
        const socket = socketIOClient(URL);
        socket.emit('winnerBingo', winBingo);
      }
    }
  }

  //TEMPORAL
  const sendBingo = () => {
    const winBingo = { bingo: true, name, price: bingoPrice };
    setWinnerBingo(winBingo);
    const socket = socketIOClient(URL);
    socket.emit('winnerBingo', winBingo)
  }
  
  const checkFirstLine = () => {
    if (!winnerFirstLine.line) {
      for (let i = 0; i < card.length; i++) {
        const line = card[i];
        const lineMatched = line.every((element) => element.matched);
        if (lineMatched) {
          const winLine = { line: true, name, price: linePrice };
          const socket = socketIOClient(URL);
          socket.emit('winnerFirstLine', winLine);
          setWinnerFirstLine(winLine);
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
        <button onClick={sendBingo}>-SendBingo</button>
        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.buttonReturn} onClick={returnMain}>{'<'}</button>
          <h3 className={styles.colorWhite}>{`PREMIOS:  Linea => ${linePrice.toFixed(2)}€  / Bingo => ${bingoPrice.toFixed(2)}€`}</h3>
          <h3 className={styles.colorWhite}>{`P/cartón: ${priceCard}€`}</h3>
        <div className={styles.userInfo}>
          <Image  src={`/${superHeroImage}.png`} width={50} height={50} className={styles.avatar}alt="Picture of the author" />
          <p>{name}</p>
          </div>
        </div>
        {/* HEADER */}
        <div className={styles.numberContainer}>
            {listRandomNumber.length > 0 && <div className={styles.randomNumber}>{listRandomNumber[listRandomNumber.length - 1]}</div>}
        </div>
        {/* INFO */}
          <div className={styles.infoGame}>
          <UserList userList={userList.filter(user => user.name !== name)} winnerFirstLine={winnerFirstLine} winnerBingo={winnerBingo} />
            <Ranking />
          </div>
        <div>
          {winnerBingo.bingo && <Image
            src="/200w.gif"
            width={500}
            height={500}
            className={styles.image}
            alt="Picture of the author"
          />}
            </div>
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
    </div>)
}   

