import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function OneMovieGraphQL() {
  const [movie, setMovie] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  const { id } = useParams()

  useEffect(() => {
    async function getMovieById() {
      const payload = `
          {
            movie(id: ${id}) {
              id
              title
              description
              runtime
              year
              release_date
              rating
              mpaa_rating
              poster
            }
          }
        `

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      }

      const response = await fetch(
        'http://localhost:4000/v1/graphql',
        requestOptions,
      )

      const data = await response.json()

      if (data.error) {
        setAlert({ type: 'alert-danger', message: data.error.message })
      } else {
        setMovie(data.data.movie)
        setIsLoaded(true)
      }
    }

    getMovieById().catch((error) => {
      setError(error.message)
      setIsLoaded(true)
    })
  }, [])

  if (movie.genres) {
    movie.genres = Object.values(movie.genres)
  } else {
    movie.genres = []
  }

  if (error) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <>
        <h2>
          Movie: {movie.title} ({movie.year})
        </h2>

        {movie.poster !== '' && (
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
              alt={movie.title}
            />
          </div>
        )}

        <div className='float-start'>
          <small>Rating: {movie.mpaa_rating}</small>
        </div>

        <div className='float-end'>
          {movie.genres.map((genre, index) => (
            <span className='badge bg-secondary me-1' key={index}>
              {genre}
            </span>
          ))}
        </div>
        <div className='clearfix'></div>
        <hr />

        <table className='table table-compact table-striped'>
          <thead></thead>
          <tbody>
            {/* 1st row */}
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>{movie.title}</td>
            </tr>
            {/* 2nd row */}
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{movie.description}</td>
            </tr>
            {/* 3rd row */}
            <tr>
              <td>
                <strong>Run time:</strong>
              </td>
              <td>{movie.runtime}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  }
}
