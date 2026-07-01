import Image from 'next/image';
import { useMemo } from 'react';
import { PROGRESS_HIGH, PROGRESS_MID } from '../../utils/constants';
import style from './UserList.module.css';

const progressColor = (completed) =>
    completed >= PROGRESS_HIGH ? 'rgb(6, 236, 6)'
        : completed >= PROGRESS_MID ? 'rgb(33, 200, 255)'
            : 'black';

export const UserList = ({ userList, winnerFirstLine, winnerBingo, getSuperHeroById }) => {
    // Copy before sorting to avoid mutating the array passed via props, and only
    // re-sort when the list actually changes.
    const sortedUsers = useMemo(
        () => [...userList].sort((a, b) => b.completed - a.completed),
        [userList]
    );

    return (
        <div className={style.list}>
            <h3 className={style.title}>Jugadores</h3>
            {sortedUsers.map((user, index) => (
                <div key={index} className={style.element} style={{ color: progressColor(user.completed) }}>
                    <p>{index + 1} - </p>
                    <div className={style.avatar}>
                        <Image src={getSuperHeroById(user.superHeroImage)} width={32} height={32} className={style.avatar} alt="Picture of the author" />
                    </div>
                    <p>{user.name} - </p>
                    <p>{`${user.completed}%`}</p>
                    {winnerFirstLine?.name === user.name && <p className={style.line}>- Linea</p>}
                    {winnerBingo?.name === user.name && <p className={style.bingo}>- Bingo</p>}
                </div>
            ))}
        </div>
    );
};
