import { memo } from 'react';
import styles from './User.module.css';

// The player's own bingo card. Memoized with a stable `onSelect` so that a new
// number being drawn (which re-renders the parent) doesn't rebuild the whole
// grid — it only re-renders when the card itself changes.
export const BingoCard = memo(function BingoCard({ card, onSelect, disabled = false }) {
    return (
        <table className={styles.table}>
            <tbody>
                {card.map((line, indexColumn) => (
                    <tr key={indexColumn}>
                        {line.map((element, indexLine) => (
                            <td key={element.number} className={styles.td}>
                                <button
                                    className={`${styles.buttonNumber} ${element.matched ? styles.matched : ''}`}
                                    onClick={() => onSelect(indexColumn, indexLine)}
                                    disabled={disabled}
                                >
                                    {element.number}
                                </button>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
});
