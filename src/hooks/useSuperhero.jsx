import { useEffect, useState } from "react"

export const useSuperhero = () => {
    const [superHeroImage, setSuperHeroImage] = useState([])

  
    const superHeroeId = [149, 332, 346,620,644, 69,717,655, 558,561, 106,275,303]

  const getSuperHeroImage = async () => {
    const data = []
    const responseImages =  Promise.all(superHeroeId.map((id) => fetch(`https://cdn.jsdelivr.net/gh/akabab/superhero-api/api/id/${id}.json`)
        .then((response) => response.json())
        .then((user) => data.push({ image: user.images.sm , id: user.id})))
    )

    await responseImages
    setSuperHeroImage(data)
  }
  useEffect(() => {
    getSuperHeroImage()
  }, [])

  const getSuperHeroById = (id) => {
    const [superHero] = superHeroImage.filter((superHero) => {
      return superHero.id == id
    })

    return superHero?.image || superHeroImage[0]?.image
  }

  return {
    superHeroImage,
    getSuperHeroById
  }
}