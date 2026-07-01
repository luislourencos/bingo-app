import Landing from '@/components/Landing/Landing';
import { getBingoGif, getCats } from '@/lib/cats';

export default async function Home() {
  const [superHeroImage, bingoGif] = await Promise.all([getCats(), getBingoGif()]);
  return <Landing superHeroImage={superHeroImage} bingoGif={bingoGif} />;
}
