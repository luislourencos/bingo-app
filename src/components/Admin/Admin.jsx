"use client"

import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { URL } from '../../utils/constants';


export const Admin = () => { 
    const [listRandomNumber, setListRandomNumber] = useState([]);
    useEffect(() => {
        console.log('socketEnter');
        const socket = socketIOClient(URL);
        socket.on("FromAPI", data => {
            console.log('soketData',data);
        });
   
        return () => socket.disconnect();
    }, []);

    const randomNumber = () => {
        // random number between 1-60
        const random = Math.floor(Math.random() * 60) + 1;
        const socket = socketIOClient(URL);
     
        if (listRandomNumber.includes(random)) {
 
            randomNumber();
        } else {
     
            setListRandomNumber([...listRandomNumber, random]);
            socket.emit('randomNumbers', { numbers: [...listRandomNumber, random], user: 'admin' });
        }
    }    

    console.log('listRandomNumber',listRandomNumber);
        
        
    
    const restart = () => {
        setListRandomNumber([]);
        const socket = socketIOClient(URL);
        socket.emit('restart');
    }
    return (
        <div>
            <h2>Admin</h2>
            <button onClick={restart}>Restart</button>
            <button onClick={randomNumber}>Random Number</button>
            {listRandomNumber.map((number, index) => {
                return <div key={index}>{number}</div>
            })}
        </div>
    )
}   

