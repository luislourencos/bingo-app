import Image from 'next/image';
import style from './UserList.module.css';

export const UserList = ({ userList, winnerFirstLine, winnerBingo, getSuperHeroById  }) => {


    userList.sort((a, b) => {
        return b.completed - a.completed;
    });

    return (<div className={style.list}>
        <h3 className={style.title}>Jugadores</h3>
        {
            userList?.map((user, index) => {
                return <div key={index} className={style.element}  style={{color:user.completed>=77?'rgb(6, 236, 6)': user.completed>=50?'rgb(33, 200, 255)': 'black'}} >
                    <p>{index + 1} - </p>
                    <div className={style.avatar}>
                        <Image  src={getSuperHeroById(user.superHeroImage)} width={60} height={70} className={style.avatar} alt="Picture of the author" />
                    </div>
                    <p>{user.name} - </p>
                    <p>{`${user.completed}%`}</p>  
                    {winnerFirstLine?.name === user.name && <p className={style.line}>- Linea</p>}
                    {winnerBingo?.name === user.name && <p className={style.bingo}>- Bingo</p>}
                </div>
            })}
    </div>)
    
}