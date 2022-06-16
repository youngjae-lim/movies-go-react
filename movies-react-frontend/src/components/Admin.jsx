import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Admin(props) {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (props.jwt === '') {
      props.history.push({ pathname: '/login' })
      return
    }
    
    async function getMovies() {
      const response = await fetch('http://localhost:4000/v1/movies')

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
        <h2>Edit a movie</h2>
        <div className='list-group'>
          {movies.map((movie) => (
            <Link
              to={`/admin/movie/${movie.id}`}
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

export default Admin
