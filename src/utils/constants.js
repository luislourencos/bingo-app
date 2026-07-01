const env = process.env.NODE_ENV || 'development';

export const URL = env === 'development' ? 'http://localhost:3000' : 'https://supermarkets-bingo.onrender.com';

// Bingo balls go from 1 to MAX_NUMBER.
export const MAX_NUMBER = 50;

// Room / player rules.
export const ROOM_ID_LENGTH = 5;
export const MAX_NAME_LENGTH = 10;
export const ADMIN_NAME = 'admin6232';
export const ROOM_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Lives a player starts with; marking a number that hasn't been drawn costs one.
export const MAX_LIVES = 7;

// Player-progress colour thresholds (percent complete) used in the players list.
export const PROGRESS_HIGH = 77;
export const PROGRESS_MID = 50;

// How long the win / animation overlays stay on screen (ms).
export const BINGO_WIN_MS = 10000;
export const LINE_WIN_MS = 5000;
export const FLIP_MS = 8000;
export const HIDE_MS = 8000;

const GIPHY = 'https://giphy.com/embed/';

// Celebration gifs shown when a player gets the full card (bingo).
export const WIN_GIFS = [
    { src: `${GIPHY}cXblnKXr2BQOaYnTni`, width: 480, height: 400 },
    { src: `${GIPHY}3oFzmpzTfyABIX6JBm`, width: 480, height: 444 },
    { src: `${GIPHY}ummeQH0c3jdm2o3Olp`, width: 480, height: 360 },
    { src: `${GIPHY}U56VoSyFD8MFcie2k8`, width: 480, height: 480 },
    { src: `${GIPHY}U56VoSyFD8MFcie2k8`, width: 480, height: 480 },
    { src: `${GIPHY}DFu7j1d1AQbaE`, width: 480, height: 480 },
    { src: `${GIPHY}gjZwGGfhw1zd3tBGok`, width: 480, height: 480 },
    { src: `${GIPHY}gjZwGGfhw1zd3tBGok`, width: 480, height: 480 },
];

// Gifs shown when a player completes just the first line.
export const LINE_GIFS = [
    { src: `${GIPHY}nqi89GMgyT3va`, width: 428, height: 480 },
    { src: `${GIPHY}o75ajIFH0QnQC3nCeD`, width: 480, height: 400 },
    { src: `${GIPHY}o75ajIFH0QnQC3nCeD`, width: 480, height: 400 },
    { src: `${GIPHY}ddHhhUBn25cuQ`, width: 480, height: 270 },
    { src: `${GIPHY}5oGIdt1xapQ76`, width: 480, height: 480 },
    { src: `${GIPHY}uudzUtVcsLAoo`, width: 480, height: 395 },
    { src: `${GIPHY}vvbGMpbhZMcHSsD50w`, width: 480, height: 361 },
    { src: `${GIPHY}3rUbeDiLFMtAOIBErf`, width: 480, height: 270 },
];
