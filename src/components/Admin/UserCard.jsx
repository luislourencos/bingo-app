import { memo } from "react";
import style from './Admin.module.css';

// A single player's card. Memoized so drawing a new number (which only changes
// the admin's number list) doesn't force every player's card to re-render.
export const UserCard = memo(function UserCard({ user }) {
    return (
        <div className={style.cardContainer}>
            <h5>{decodeURI(user.name)}</h5>
            <table className={style.table}>
                <tbody>
                    {user.card?.map((line, indexColumn) => (
                        <tr key={indexColumn}>
                            {line.map((element) => (
                                <td key={element.number} className={style.td}>
                                    <div className={`${style.buttonNumber} ${element.matched ? style.matched : ''}`}>
                                        {element.number}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
