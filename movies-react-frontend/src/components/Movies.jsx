import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Movies() {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getMovies() {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/v1/movies`)

      if (!response.ok) {
        const message = `Invalid response code: ${response.status}`
        throw new Error(message)
      }

      const data = await response.json()
      setMovies(data.movies)
      setIsLoaded(true)
    }

    getMovies().catch((error) => {
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
        <h2>Choose a movie</h2>
        <div className='list-group'>
          {movies.map((movie) => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className='list-group-item list-group-item-action'
            >
              {movie.title}
            </Link>
          ))}
        </div>
      </>
    )
  }
}

export default Movies
