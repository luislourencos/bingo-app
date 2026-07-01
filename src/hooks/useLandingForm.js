import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ADMIN_NAME, MAX_NAME_LENGTH, ROOM_ID_CHARS, ROOM_ID_LENGTH } from '@/utils/constants';

const ROOM_ID_REGEX = new RegExp(`^[a-zA-Z0-9]{${ROOM_ID_LENGTH}}$`);

// Encapsulates all the landing form state (room id, name, selected avatar),
// its validation/navigation logic and the input handlers so the component
// only has to worry about rendering.
export function useLandingForm() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(id ? decodeURIComponent(id) : '');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState();

  // Keep the room id restricted to letters and numbers as the user types.
  const onRoomChange = useCallback((e) => {
    setRoom(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
  }, []);

  const onNameChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const enterGame = useCallback(() => {
    if (!room) {
      alert('Introduce el id de la sala');
      return;
    }
    if (!ROOM_ID_REGEX.test(room)) {
      alert(`El id de la sala debe tener exactamente ${ROOM_ID_LENGTH} caracteres (solo letras o números, sin espacios ni símbolos)`);
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      alert(`El nombre no puede tener más de ${MAX_NAME_LENGTH} caracteres`);
      return;
    }
    if (!selectedAvatar) {
      alert('Debes seleccionar un avatar');
      return;
    }
    if (!name) {
      return;
    }
    if (name === ADMIN_NAME) {
      router.push(`/${room}/admin`);
    } else {
      router.push(`/${room}/${name}/${selectedAvatar}`);
    }
  }, [room, name, selectedAvatar, router]);

  const createRoom = useCallback(() => {
    let newRoom = '';
    for (let i = 0; i < ROOM_ID_LENGTH; i++) {
      newRoom += ROOM_ID_CHARS[Math.floor(Math.random() * ROOM_ID_CHARS.length)];
    }
    router.push(`/${newRoom}/admin`);
  }, [router]);

  return {
    room,
    name,
    selectedAvatar,
    setSelectedAvatar,
    onRoomChange,
    onNameChange,
    enterGame,
    createRoom,
  };
}
