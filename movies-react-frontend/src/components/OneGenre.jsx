import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

export default function OneGenre() {
  const [movies, setMovies] = useState([])
  const [genreName, setGenreName] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  const { genre_id } = useParams()
  const location = useLocation()

  useEffect(() => {
    async function getMoviesByGenre() {
      const response = await fetch(
        `http://localhost:4000/v1/genres/${genre_id}`,
      )

      if (!response.ok) {
        const message = `Invalid response code: ${response.status}`
        throw new Error(message)
      }

      const data = await response.json()
      setMovies(data.movies)
      setIsLoaded(true)
      setGenreName(location.genreName)
    }

    getMoviesByGenre().catch((error) => {
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
        <h2>Genre: {genreName}</h2>
        <h3>{!movies ? 'There are no movies of the genre.' : ''}</h3>
        <div className='list-group'>
          {movies?.map((movie) => (
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
