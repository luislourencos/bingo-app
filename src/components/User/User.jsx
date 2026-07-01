import Image from 'next/image';
import { useMemo } from 'react';
import { MAX_LIVES } from '@/utils/constants';
import { useUserGame } from '@/hooks/useUserGame';
import { BingoCard } from './BingoCard';
import { BingoWin } from '../BingoWin/BingoWin';
import { Loading } from '../Loading/Loading';
import { Ranking } from '../Ranking/Ranking';
import { UserList } from '../UserList/UserList';
import styles from './User.module.css';

export const User = ({ roomId, name, superHeroImage }) => {
    const {
        card,
        userList,
        isLoading,
        listRandomNumber,
        winnerBingo,
        showWinnerBingo,
        winnerFirstLine,
        showWinnerLine,
        slideCat,
        setSlideCat,
        flipped,
        hidden,
        sendMode,
        setSendMode,
        sentCat,
        sentFlip,
        sentHide,
        lives,
        losingLifeIndex,
        setLosingLifeIndex,
        eliminated,
        selectNumber,
        returnMain,
        sendSpecial,
        getSuperHeroById,
    } = useUserGame({ roomId, name, superHeroImage });

    // All drawn numbers except the latest one (shown big below). Rebuilt only
    // when the drawn list changes, not on every unrelated re-render.
    const drawnNumbers = useMemo(
        () => listRandomNumber.slice(0, -1).map((number) => (
            <div className={styles.numbers} key={number}>{number}</div>
        )),
        [listRandomNumber]
    );

    if (isLoading) {
        return (
            <div className={styles.containerLoading}>
                <Loading />
            </div>)
    }

    return (
      <div className={`${styles.container} ${flipped ? styles.flipped : ''}`}>
        {winnerBingo.bingo && showWinnerBingo && <BingoWin winnerBingo={winnerBingo} />}
        {winnerFirstLine.line && showWinnerLine && <BingoWin winnerBingo={winnerFirstLine} />}
        {eliminated && (
          <div className={styles.eliminatedOverlay}>
            <div className={styles.eliminatedDialog}>
              <div className={styles.sadFace}>😢</div>
              <h3 className={styles.eliminatedTitle}>Has perdido tus 7 vidas</h3>
              <p className={styles.eliminatedText}>Quedas eliminado del juego.</p>
              <button className={styles.eliminatedButton} onClick={returnMain}>Salir</button>
            </div>
          </div>
        )}
        {slideCat && (
          <Image
            src="/pngwing.com.png"
            alt=""
            width={500}
            height={500}
            className={styles.slidingCat}
            onAnimationEnd={() => setSlideCat(false)}
          />
        )}
        {sendMode && (
          <div className={styles.catDialogOverlay} onClick={() => setSendMode(null)}>
            <div className={styles.catDialog} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.catDialogTitle}>Enviar {sendMode === 'flip' ? '🔄' : sendMode === 'hide' ? '🙈' : '🐱'} a</h3>
              <div className={styles.catUserList}>
                {userList.filter((user) => user.name !== name).length === 0 && (
                  <p className={styles.catEmpty}>No hay otros jugadores</p>
                )}
                {userList
                  .filter((user) => user.name !== name)
                  .map((user) => (
                    <button
                      key={user.name}
                      className={styles.catUserButton}
                      onClick={() => sendSpecial(user)}
                    >
                      <Image
                        src={getSuperHeroById(user.superHeroImage)}
                        width={20}
                        height={20}
                        className={styles.avatar}
                        alt=""
                      />
                      {user.name}
                    </button>
                  ))}
              </div>
              <button className={styles.catDialogClose} onClick={() => setSendMode(null)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
        {/* HEADER */}
        <div className={styles.header}>
          <button className={styles.buttonReturn} onClick={returnMain}>{'<'}</button>
          <button className={styles.buttonCat} onClick={() => setSendMode('cat')} disabled={sentCat || listRandomNumber.length === 0}>Enviar 🐱</button>
          <button className={styles.buttonCat} onClick={() => setSendMode('flip')} disabled={sentFlip || listRandomNumber.length === 0}>Girar 🔄</button>
          <button className={styles.buttonCat} onClick={() => setSendMode('hide')} disabled={sentHide || listRandomNumber.length === 0}>Esconder 🙈</button>
        <div className={styles.userInfo}>
          <Image  src={getSuperHeroById(superHeroImage)} width={30} height={30} className={styles.avatar}alt="Picture of the author" />
          <p >{decodeURI(name)}</p>
          </div>
        </div>

        {/* INFO */}
          <div className={styles.infoGame}>
            <UserList getSuperHeroById={getSuperHeroById} userList={userList.filter(user => user.name !== name)} winnerFirstLine={winnerFirstLine} winnerBingo={winnerBingo} />
            <Ranking />
          </div>

          {/* LIVES */}
          <div className={styles.lives}>
            {Array.from({ length: MAX_LIVES }).map((_, index) => {
              const lostCount = MAX_LIVES - lives;
              // Lives are lost left-to-right: the leftmost `lostCount` hearts
              // are the empty ones, the rest (to the right) are still alive.
              const alive = index >= lostCount;
              const justLost = losingLifeIndex !== null && index === lostCount - 1;
              return (
                <span
                  key={index}
                  className={`${styles.life} ${alive ? '' : styles.lifeGone} ${justLost ? styles.lifeLosing : ''}`}
                  onAnimationEnd={justLost ? () => setLosingLifeIndex(null) : undefined}
                >
                  {justLost ? '💔' : alive ? '❤️' : '🖤'}
                </span>
              );
            })}
          </div>

            <div className={styles.numberList}>
        {drawnNumbers}
        </div>
      <div className={styles.numberContainer}>
             {hidden &&<Image
                src="https://cataas.com/cat/gif"
                alt="cat"
                width={80}
                height={80}
                unoptimized
                className={styles.hideCat}
              />}
            {listRandomNumber.length > 0 && <div className={styles.randomNumber}>{listRandomNumber[listRandomNumber.length - 1]}</div>}
      <BingoCard card={card} onSelect={selectNumber} disabled={listRandomNumber.length === 0} />
          </div>
    </div>)
}
