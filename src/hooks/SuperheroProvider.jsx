
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';


const SuperheroContext = createContext(null);

const SuperheroProvider = ({ children }) => {
    const [superHeroImage, setSuperHeroImage] = useState([])

  const getSuperHeroImage = async () => {
    const cats = await (await fetch('https://cataas.com/api/cats?limit=20&skip=0')).json()
    const data = cats.map((cat)=> ({image: `https://cataas.com/cat/${cat.id}`, id: cat.id}))
    setSuperHeroImage(data)
  }
  useEffect(() => {
    getSuperHeroImage()
  }, [])

  // Index by id once so lookups are O(1) instead of scanning the array each call.
  const imageById = useMemo(() => {
    const map = new Map();
    superHeroImage.forEach((hero) => map.set(String(hero.id), hero.image));
    return map;
  }, [superHeroImage]);

  const getSuperHeroById = useCallback(
    (id) => imageById.get(String(id)) || superHeroImage[0]?.image,
    [imageById, superHeroImage]
  );

  const value = useMemo(
    () => ({ getSuperHeroById, superHeroImage }),
    [getSuperHeroById, superHeroImage]
  );

  return (
    <SuperheroContext.Provider value={value}>
      {children}
    </SuperheroContext.Provider>
  );
};

const useSuperhero = () => {
  const context = useContext(SuperheroContext);
  if (context === undefined) {
    throw new Error(
      'useSuperheroContext must be used within a SuperheroProvider'
    );
  }
  return context;
};

export { SuperheroProvider, useSuperhero };

