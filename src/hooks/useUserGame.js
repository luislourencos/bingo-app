import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BINGO_WIN_MS, FLIP_MS, HIDE_MS, LINE_WIN_MS, URL } from '@/utils/constants';
import { clearRoomState, clearState, loadState, roomKey, saveState } from '@/utils/sessionState';
import { getSocket } from '@/utils/socket';
import { useSuperhero } from '@/hooks/SuperheroProvider';
import { useTimeout } from '@/hooks/useTimeout';

// Owns all the state, socket wiring, session persistence and game logic for a
// player's bingo screen. The User component only consumes the returned values
// and renders them.
export function useUserGame({ roomId, name, superHeroImage }) {
  const room = roomId ? decodeURIComponent(roomId) : '';
  const router = useRouter();
  const { getSuperHeroById } = useSuperhero();

  const [priceCard, setPriceCard] = useState(0);
  const [userList, setUserList] = useState([]);
  const [card, setCard] = useState([]);
  const [isLoading, setISLoading] = useState(true);
  const [listRandomNumber, setListRandomNumber] = useState([]);

  const linePrice = userList.length * (priceCard / 3);
  const bingoPrice = userList.length * priceCard - linePrice;

  const [winnerFirstLine, setWinnerFirstLine] = useState({ line: false, name: '', price: linePrice });
  const [winnerBingo, setWinnerBingo] = useState({ bingo: false, name: '', price: bingoPrice });
  const [showWinnerBingo, setShowWinnerBingo] = useState(true);
  const [showWinnerLine, setShowWinnerLine] = useState(true);

  // Special actions (cat / flip / hide) sent between players.
  const [slideCat, setSlideCat] = useState(false);
  // Which "send to a player" dialog is open: null | 'cat' | 'flip' | 'hide'.
  const [sendMode, setSendMode] = useState(null);
  // A player may send one cat, one flip and one hide per game. Each flag
  // disables its own button until the game is restarted.
  const [sentCat, setSentCat] = useState(false);
  const [sentFlip, setSentFlip] = useState(false);
  const [sentHide, setSentHide] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Auto-dismissing overlays.
  useTimeout(flipped, FLIP_MS, () => setFlipped(false));
  useTimeout(hidden, HIDE_MS, () => setHidden(false));
  useTimeout(winnerBingo.bingo, BINGO_WIN_MS, () => setShowWinnerBingo(false));
  useTimeout(winnerFirstLine.line, LINE_WIN_MS, () => setShowWinnerLine(false));

  const getCard = () => {
    fetch(`${URL}/api/getCard`)
      .then((response) => response.json())
      .then((data) => setCard(data));
  };

  // Single shared connection + all listeners registered once.
  useEffect(() => {
    if (!room) return;
    const socket = getSocket();
    socket.emit('joinRoom', room);

    const onWinnerFirstLine = (data) => setWinnerFirstLine(data);
    const onPriceCard = (data) => setPriceCard(data);
    const onWinnerBingo = (data) => setWinnerBingo(data);
    const onRandomNumbers = (data) => setListRandomNumber(data.numbers);
    const onUserList = (data) =>
      setUserList(data.map((user) => ({ ...user, name: decodeURI(user.name) })));
    const onRestart = () => {
      if (room && name) {
        clearState(roomKey(room, 'user', name, 'card'));
        clearState(roomKey(room, 'user', name, 'winnerBingo'));
        clearState(roomKey(room, 'user', name, 'winnerFirstLine'));
        clearState(roomKey(room, 'user', name, 'sentCat'));
        clearState(roomKey(room, 'user', name, 'sentFlip'));
        clearState(roomKey(room, 'user', name, 'sentHide'));
      }
      setWinnerBingo({ bingo: false, name: '', price: 0 });
      setWinnerFirstLine({ line: false, name: '', price: 0 });
      setSentCat(false);
      setSentFlip(false);
      setSentHide(false);
      getCard();
    };
    const onResetAll = () => {
      if (room) clearRoomState(room);
      router.push('/');
    };
    const onJoinError = (message) => {
      alert(message);
      router.push('/');
    };
    const onReceiveCat = () => setSlideCat(true);
    const onReceiveFlip = () => setFlipped(true);
    const onReceiveHide = () => setHidden(true);

    socket.on('joinError', onJoinError);
    socket.on('receiveCat', onReceiveCat);
    socket.on('receiveFlip', onReceiveFlip);
    socket.on('receiveHide', onReceiveHide);
    socket.on('roomFull', onJoinError);
    socket.on('winnerFirstLine', onWinnerFirstLine);
    socket.on('priceCard', onPriceCard);
    socket.on('winnerBingo', onWinnerBingo);
    socket.on('randomNumbers', onRandomNumbers);
    socket.on('userList', onUserList);
    socket.on('restart', onRestart);
    socket.on('resetAll', onResetAll);

    return () => {
      socket.off('winnerFirstLine', onWinnerFirstLine);
      socket.off('priceCard', onPriceCard);
      socket.off('winnerBingo', onWinnerBingo);
      socket.off('randomNumbers', onRandomNumbers);
      socket.off('userList', onUserList);
      socket.off('restart', onRestart);
      socket.off('resetAll', onResetAll);
      socket.off('joinError', onJoinError);
      socket.off('roomFull', onJoinError);
      socket.off('receiveCat', onReceiveCat);
      socket.off('receiveFlip', onReceiveFlip);
      socket.off('receiveHide', onReceiveHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    getSocket().emit('user', { name, card, superHeroImage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  // On (re)load: restore the saved card so a refresh keeps the marked numbers,
  // otherwise fetch a fresh one. Also restore any winner status.
  useEffect(() => {
    if (!room || !name) {
      getCard();
      return;
    }
    const savedCard = loadState(roomKey(room, 'user', name, 'card'), null);
    if (savedCard && savedCard.length) {
      setCard(savedCard);
    } else {
      getCard();
    }
    const savedBingo = loadState(roomKey(room, 'user', name, 'winnerBingo'), null);
    if (savedBingo) setWinnerBingo(savedBingo);
    const savedLine = loadState(roomKey(room, 'user', name, 'winnerFirstLine'), null);
    if (savedLine) setWinnerFirstLine(savedLine);
    if (loadState(roomKey(room, 'user', name, 'sentCat'), false)) setSentCat(true);
    if (loadState(roomKey(room, 'user', name, 'sentFlip'), false)) setSentFlip(true);
    if (loadState(roomKey(room, 'user', name, 'sentHide'), false)) setSentHide(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, name]);

  // Persist the card (and winner / sent status) so they survive a refresh.
  useEffect(() => {
    if (room && name && card.length > 0) {
      saveState(roomKey(room, 'user', name, 'card'), card);
    }
  }, [card, room, name]);

  useEffect(() => {
    if (room && name && winnerBingo.bingo) {
      saveState(roomKey(room, 'user', name, 'winnerBingo'), winnerBingo);
    }
  }, [winnerBingo, room, name]);

  useEffect(() => {
    if (room && name && winnerFirstLine.line) {
      saveState(roomKey(room, 'user', name, 'winnerFirstLine'), winnerFirstLine);
    }
  }, [winnerFirstLine, room, name]);

  useEffect(() => {
    if (room && name && sentCat) {
      saveState(roomKey(room, 'user', name, 'sentCat'), true);
    }
  }, [sentCat, room, name]);

  useEffect(() => {
    if (room && name && sentFlip) {
      saveState(roomKey(room, 'user', name, 'sentFlip'), true);
    }
  }, [sentFlip, room, name]);

  useEffect(() => {
    if (room && name && sentHide) {
      saveState(roomKey(room, 'user', name, 'sentHide'), true);
    }
  }, [sentHide, room, name]);

  useEffect(() => {
    if (card.length > 0) {
      setISLoading(false);
    }
  }, [card]);

  // Keep the values selectNumber needs in refs so the handler can stay stable
  // (its identity never changes) and BingoCard's memoization actually pays
  // off: drawing a number won't rebuild the grid, only marking a cell does.
  const cardRef = useRef(card);
  const listRandomNumberRef = useRef(listRandomNumber);
  const winnerBingoRef = useRef(winnerBingo);
  const winnerFirstLineRef = useRef(winnerFirstLine);
  const pricesRef = useRef({ linePrice, bingoPrice });
  useEffect(() => { cardRef.current = card; }, [card]);
  useEffect(() => { listRandomNumberRef.current = listRandomNumber; }, [listRandomNumber]);
  useEffect(() => { winnerBingoRef.current = winnerBingo; }, [winnerBingo]);
  useEffect(() => { winnerFirstLineRef.current = winnerFirstLine; }, [winnerFirstLine]);
  useEffect(() => { pricesRef.current = { linePrice, bingoPrice }; }, [linePrice, bingoPrice]);

  const selectNumber = useCallback((column, line) => {
    const currentCard = cardRef.current;
    const number = currentCard[column][line].number;
    if (!listRandomNumberRef.current.includes(number)) return;

    const newCard = currentCard.map((row, c) =>
      c === column
        ? row.map((cell, l) => (l === line ? { ...cell, matched: true } : cell))
        : row
    );
    setCard(newCard);

    // First line: any fully-matched row.
    if (!winnerFirstLineRef.current.line) {
      const hasLine = newCard.some((row) => row.every((cell) => cell.matched));
      if (hasLine) {
        const winLine = { line: true, name, price: pricesRef.current.linePrice, superHeroImage };
        getSocket().emit('winnerFirstLine', winLine);
        setWinnerFirstLine(winLine);
        setShowWinnerLine(true);
      }
    }

    // Bingo: the whole card matched.
    if (!winnerBingoRef.current.bingo) {
      const bingo = newCard.every((row) => row.every((cell) => cell.matched));
      if (bingo) {
        const winBingo = { bingo: true, name, price: pricesRef.current.bingoPrice, superHeroImage };
        setWinnerBingo(winBingo);
        setShowWinnerBingo(true);
        getSocket().emit('winnerBingo', winBingo);
      }
    }
  }, [name, superHeroImage]);

  const returnMain = () => {
    getSocket().emit('removeUser', { name });
    router.push('/');
  };

  // Send the selected animation (cat / flip / hide) to another player. Names in
  // userList are decoded for display, so re-encode to match how the server
  // stores them. One of each is allowed per game; each mode gates its own
  // button afterwards.
  const sendSpecial = (user) => {
    if (sendMode === 'flip') {
      if (sentFlip) return;
      getSocket().emit('sendFlip', { to: encodeURI(user.name) });
      setSentFlip(true);
    } else if (sendMode === 'hide') {
      if (sentHide) return;
      getSocket().emit('sendHide', { to: encodeURI(user.name) });
      setSentHide(true);
    } else {
      if (sentCat) return;
      getSocket().emit('sendCat', { to: encodeURI(user.name) });
      setSentCat(true);
    }
    setSendMode(null);
  };

  return {
    // data
    card,
    userList,
    isLoading,
    listRandomNumber,
    // winners
    winnerBingo,
    showWinnerBingo,
    winnerFirstLine,
    showWinnerLine,
    // special actions
    slideCat,
    setSlideCat,
    flipped,
    hidden,
    sendMode,
    setSendMode,
    sentCat,
    sentFlip,
    sentHide,
    // handlers
    selectNumber,
    returnMain,
    sendSpecial,
    // helpers
    getSuperHeroById,
  };
}
