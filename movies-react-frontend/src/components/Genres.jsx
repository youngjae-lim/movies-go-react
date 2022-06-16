import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Genres() {
  const [genres, setGenres] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getGenres() {
      const response = await fetch('http://localhost:4000/v1/genres')

      if (!response.ok) {
        const message = `Invalid response code: ${response.status}`
        throw new Error(message)
      }

      const data = await response.json()
      setGenres(data.genres)
      setIsLoaded(true)
    }

    getGenres().catch((error) => {
      setError(error.message)
      setIsLoaded(true)
    })
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <>
        <h2>Genres</h2>
        <div className='list-group'>
          {genres.map((genre) => (
            <Link
              to={{
                pathname: `/genres/${genre.id}`,
                genreName: genre.genre_name,
              }}
              key={genre.id}
              className='list-group-item list-group-item-action'
            >
              {genre.genre_name}
            </Link>
          ))}
        </div>
      </>
    )
  }
}
