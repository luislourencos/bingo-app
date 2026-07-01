import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MAX_NUMBER } from '@/utils/constants';
import { getSocket } from '@/utils/socket';
import { clearRoomState, loadState, roomKey, saveState } from '@/utils/sessionState';

// Owns all the state, socket wiring, session persistence and actions for the
// admin (game host) screen. The Admin component only renders the returned
// values.
export function useAdminGame() {
  const router = useRouter();
  const { id } = useParams();
  const roomId = id ? decodeURIComponent(id) : '';

  const [listRandomNumber, setListRandomNumber] = useState([]);
  const [userList, setUserList] = useState([]);
  const [cardPrice, setCardPrice] = useState(0.15);

  // Restore persisted state on (re)load so a refresh doesn't lose the game.
  useEffect(() => {
    if (!roomId) return;
    const savedNumbers = loadState(roomKey(roomId, 'admin', 'numbers'), []);
    if (savedNumbers.length) setListRandomNumber(savedNumbers);
    const savedPrice = loadState(roomKey(roomId, 'admin', 'price'), null);
    if (savedPrice != null) setCardPrice(savedPrice);
  }, [roomId]);

  // Persist drawn numbers whenever they change.
  useEffect(() => {
    if (!roomId) return;
    saveState(roomKey(roomId, 'admin', 'numbers'), listRandomNumber);
  }, [listRandomNumber, roomId]);

  // Register all listeners once on a single shared connection.
  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket();
    socket.emit('joinRoom', roomId);

    const handleUserList = (data) => setUserList(data);
    const handleWinnerFirstLine = (data) =>
      localStorage.setItem('ranking', JSON.stringify(data));
    const handleJoinError = (message) => {
      alert(message);
      router.push('/');
    };

    socket.on('userList', handleUserList);
    socket.on('winnerFirstLine', handleWinnerFirstLine);
    socket.on('joinError', handleJoinError);

    return () => {
      socket.off('userList', handleUserList);
      socket.off('winnerFirstLine', handleWinnerFirstLine);
      socket.off('joinError', handleJoinError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Notify the price whenever it changes.
  useEffect(() => {
    if (!roomId) return;
    getSocket().emit('priceCard', cardPrice);
    saveState(roomKey(roomId, 'admin', 'price'), cardPrice);
  }, [cardPrice, roomId]);

  const drawRandomNumber = useCallback(() => {
    if (listRandomNumber.length >= MAX_NUMBER) {
      alert('All numbers are out');
      return;
    }
    // Pick directly from the pool of numbers not yet drawn: a single random
    // pick instead of retrying until we miss the already-drawn ones.
    const drawn = new Set(listRandomNumber);
    const available = [];
    for (let n = 1; n <= MAX_NUMBER; n++) {
      if (!drawn.has(n)) available.push(n);
    }
    const random = available[Math.floor(Math.random() * available.length)];

    const numbers = [...listRandomNumber, random];
    setListRandomNumber(numbers);
    getSocket().emit('randomNumbers', { numbers, user: 'admin' });
  }, [listRandomNumber]);

  const restart = useCallback(() => {
    setListRandomNumber([]);
    if (roomId) {
      // Restart clears the game (numbers + user cards) but keeps the price config.
      clearRoomState(roomId);
      saveState(roomKey(roomId, 'admin', 'price'), cardPrice);
    }
    getSocket().emit('restart');
  }, [roomId, cardPrice]);

  const resetAll = useCallback(() => {
    if (roomId) clearRoomState(roomId);
    if (typeof window !== 'undefined') localStorage.removeItem('ranking');
    getSocket().emit('resetAll');
  }, [roomId]);

  const shareWhatsApp = useCallback(() => {
    const url = `${window.location.origin}/${roomId}`;
    const text = `¡Únete a mi sala de bingo! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [roomId]);

  const goHome = useCallback(() => router.push('/'), [router]);

  const lastNumber = listRandomNumber.length > 0
    ? listRandomNumber[listRandomNumber.length - 1]
    : null;

  return {
    // data
    roomId,
    listRandomNumber,
    userList,
    lastNumber,
    // actions
    drawRandomNumber,
    restart,
    resetAll,
    shareWhatsApp,
    goHome,
  };
}
