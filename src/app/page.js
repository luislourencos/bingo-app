"use client"
import { useState } from 'react';
import styles from './page.module.css';
const URL = 'https://supermarkets-bingo.onrender.com';

export default function Home(){
  const [card, setCard] = useState([]);

  const getCard = () => {
    fetch(`${URL}/api/getCard`).then((response) => {
      return response.json();
    }).then((data) => {
      setCard(data);
    })
  }


  const randomNumber = () => {
    return Math.floor(Math.random() * 15) + 1;
  }

  const selectNumber = ({ column, line }) => {
    const newCard = [...card];
    newCard[column][line].matched = true;
    setCard(newCard);
  }

  return (
    <div className={styles.container}>
      <h1  data-shadow='BINGO'>BINGO</h1>
      <button className={styles.btn} onClick={getCard}>Get Card</button> 
      <div className={styles.randomNumber}>{5}</div>
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
  );
}
