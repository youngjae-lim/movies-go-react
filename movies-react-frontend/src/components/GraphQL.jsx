import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Input from './form/Input'

export default function GraphQL() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState({ type: 'd-none', message: '' })

  useEffect(() => {
    async function getMovies() {
      const payload = `
            {
                list {
                    id
                    title
                    description
                    runtime
                    year
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
        let theList = Object.values(data.data.list)
        setMovies(theList)
        setIsLoaded(true)
      }
    }

    getMovies().catch((error) => {
      setError(error.message)
      setIsLoaded(true)
    })
  }, [])

  useEffect(() => {
    async function performSearch() {
      const payload = `
        {
          search(titleContains: "${searchTerm.toLowerCase()}") {
            id
            title
            description
            runtime
            year
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
        let theList = Object.values(data.data.search)

        if (theList.length > 0) {
          setMovies(theList)
          setIsLoaded(true)
        } else {
          setMovies([])
          setIsLoaded(true)
        }
      }
    }

    performSearch().catch((error) => {
      setError(error.message)
      setIsLoaded(true)
    })
  }, [searchTerm])

  if (error) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <>
        <h2>GraphQL</h2>
        <hr />
        <Input
          title={'Search'}
          type={'text'}
          name={'search'}
          value={searchTerm}
          handleInputChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='list-group'>
          {movies.map((movie) => (
            <Link
              to={`/graphql/movies/${movie.id}`}
              key={movie.id}
              className='list-group-item list-group-item-action'
            >
              <strong>{movie.title}</strong>
              <small className='text-muted'>
                <br />({movie.year}) - {movie.runtime} minutes
              </small>
              <br />
              {movie.description.slice(0, 100)}...
            </Link>
          ))}
        </div>
      </>
    )
  }
}
