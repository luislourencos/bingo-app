// Room-scoped sessionStorage helpers so the game state (user card, drawn
// numbers, price...) survives a page refresh but is cleared on restart / reset all.

const PREFIX = 'bingo';

const isBrowser = () => typeof window !== 'undefined';

// Build a namespaced key, e.g. roomKey('abc12', 'user', 'sergio', 'card')
// -> 'bingo:abc12:user:sergio:card'
export const roomKey = (room, ...parts) => `${PREFIX}:${room}:${parts.join(':')}`;

export const loadState = (key, fallback = null) => {
    if (!isBrowser()) return fallback;
    try {
        const raw = sessionStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

export const saveState = (key, value) => {
    if (!isBrowser()) return;
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore quota / serialization errors: persistence is best-effort.
    }
};

export const clearState = (key) => {
    if (!isBrowser()) return;
    sessionStorage.removeItem(key);
};

// Remove every persisted key for a given room (used on Reset All).
export const clearRoomState = (room) => {
    if (!isBrowser()) return;
    const needle = `${PREFIX}:${room}:`;
    Object.keys(sessionStorage)
        .filter((k) => k.startsWith(needle))
        .forEach((k) => sessionStorage.removeItem(k));
};
