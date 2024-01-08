import Image from 'next/image';
import style from './UserList.module.css';

export const UserList = ({ userList, winnerFirstLine, winnerBingo  }) => {

    // order userList by completed
    userList.sort((a, b) => {
        return b.completed - a.completed;
    });

    return (<div className={style.list}>
        {
            userList?.map((user, index) => {
                return <div key={index} className={style.element}  style={{color:user.completed>=77?'rgb(6, 236, 6)': user.completed>=50?'rgb(33, 200, 255)': 'black'}} >
                    <p>{index +1} - </p>
                    <Image  src={`/${user.superHeroImage}.png`} width={40} height={40} className={style.avatar} alt="Picture of the author" />
                    <p>{user.name} - </p>
                    <p>{`${user.completed}%`}</p>  
                    {winnerFirstLine?.name === user.name && <p className={style.line}>- Linea</p>}
                    {winnerBingo?.name === user.name && <p className={style.bingo}>- Bingo</p>}
                </div>
            })}
    </div>)
    
}