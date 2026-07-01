// Fetches the cat avatars used across the app. Runs on the server so the
// landing page can be rendered with the avatars already in place instead of
// waiting for a client-side fetch.
export async function getCats() {
  try {
    const res = await fetch('https://cataas.com/api/cats?limit=15&skip=0', {
      // Cache the list for an hour; the avatars don't need to be fresh.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const cats = await res.json();
    return cats.map((cat) => ({ image: `https://cataas.com/cat/${cat.id}`, id: cat.id }));
  } catch {
    return [];
  }
}

// Remote "BINGO" gif shown on the landing page (used as fallback if the
// server-side fetch fails).
const BINGO_GIF_URL =
  'https://cataas.com/cat/gif/says/BINGO?position=center&font=Impact&fontSize=60&fontColor=%23fff&fontBackground=none';

// Fetches the BINGO gif on the server and returns it as a base64 data URL.
// This way the request happens once on the server (cached by Next), the gif
// travels inline in the server-rendered HTML and the browser shows it instantly
// with no extra network round-trip. Falls back to the remote URL on error.
export async function getBingoGif() {
  try {
    const res = await fetch(BINGO_GIF_URL, {
      // Cache for a day: it's always the same "BINGO" banner.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return BINGO_GIF_URL;
    const contentType = res.headers.get('content-type') || 'image/gif';
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch {
    return BINGO_GIF_URL;
  }
}
