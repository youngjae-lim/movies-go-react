import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Input from './form/Input'
import TextArea from './form/TestArea'
import Select from './form/Select'
import Alert from './ui/Alert'
import '../css/EditMovie.css'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export default function EditMovie(props) {
  const [movie, setMovie] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState([])
  const [alert, setAlert] = useState({ type: 'd-none', message: '' })

  const { id } = useParams()

  const mpaaOptions = [
    { id: 'G', value: 'G' },
    { id: 'PG', value: 'PG' },
    { id: 'PG13', value: 'PG13' },
    { id: 'R', value: 'R' },
    { id: 'NC17', value: 'NC17' },
  ]

  useEffect(() => {
    if (props.jwt === '') {
      props.history.push({ pathname: '/login' })
      return
    }

    if (id > 0) {
      async function getMovie() {
        const response = await fetch(`http://localhost:4000/v1/movies/${id}`)

        if (!response.ok) {
          const message = `Invalid response code: ${response.status}`
          throw new Error(message)
        }

        const data = await response.json()
        setMovie({
          ...data.movie,
          release_date: new Date(data.movie.release_date)
            .toISOString()
            .split('T')[0],
        })
        setIsLoaded(true)
      }

      getMovie().catch((error) => {
        setError(error.message)
        setIsLoaded(true)
      })
    } else if (id === '0') {
      setMovie({
        id: 0,
        title: '',
        release_date: '',
        runtime: '',
        mpaa_rating: '',
        rating: '',
        description: '',
      })
      setIsLoaded(true)
    } else {
      const message = `Invalid URL: ${id}`
      setError(message)
      setIsLoaded(true)
    }
  }, [])

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // client side validation
    let errors = []
    if (movie.title === '') {
      errors.push('title')
    }

    setErrors(errors)

    if (errors.length > 0) {
      return false
    }

    const data = new FormData(e.target)
    const payload = Object.fromEntries(data.entries())

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.jwt}`,
      },
      body: JSON.stringify(payload),
    }

    const response = await fetch(
      `http://localhost:4000/v1/admin/editmovie`,
      requestOptions,
    )

    if (!response.ok) {
      const message = `Invalid response code: ${response.status}`
      setError(message)
      setAlert({ type: 'alert-danger', message: message })
    } else {
      const data = await response.json()

      if (data.error) {
        setAlert({ type: 'alert-danger', message: data.error.message })
      } else {
        props.history.push({ pathname: '/admin' })
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMovie({ ...movie, [name]: value })
  }

  const handleDelete = async () => {
    confirmAlert({
      title: 'Delete Movie',
      message: 'Are you sure to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            console.log(movie.id)
            const response = await fetch(
              `http://localhost:4000/v1/admin/deletemovie/${movie.id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${props.jwt}`,
                },
              },
            )

            if (!response.ok) {
              const message = `Invalid response code: ${response.status}`
              throw new Error(message)
            }

            const data = await response.json()

            if (data.error) {
              setAlert({ type: 'alert-danger', message: data.error.message })
            } else {
              props.history.push({ pathname: '/admin' })
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }

  if (error) {
    return <div>Error: {error}</div>
  } else if (!isLoaded) {
    return <p>Loading...</p>
  } else {
    return (
      <>
        <h2>Add/Edit Movie</h2>
        <Alert alertType={alert.type} alertMessage={alert.message} />
        <hr />
        <form onSubmit={handleSubmit}>
          <Input
            type={'hidden'}
            name={'id'}
            value={movie.id}
            handleInputChange={handleInputChange}
          />
          <Input
            title={'Title'}
            className={hasError('title') ? 'is-invalid' : ''}
            type={'text'}
            name={'title'}
            value={movie.title}
            handleInputChange={handleInputChange}
            errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter a title'}
          />
          <Input
            title={'Release Date'}
            type={'date'}
            name={'release_date'}
            value={movie.release_date}
            placeholder={'mm/dd/yyyy'}
            handleInputChange={handleInputChange}
          />
          <Input
            title={'Runtime'}
            type={'text'}
            name={'runtime'}
            value={movie.runtime}
            handleInputChange={handleInputChange}
          />
          <Select
            title={'MPAA Rating'}
            name={'mpaa_rating'}
            options={mpaaOptions}
            value={movie.mpaa_rating}
            placeholder={'Choose...'}
            handleInputChange={handleInputChange}
          />
          <Input
            title={'Rating'}
            type={'text'}
            name={'rating'}
            value={movie.rating}
            handleInputChange={handleInputChange}
          />
          <TextArea
            title={'Description'}
            name={'description'}
            rows={'3'}
            value={movie.description}
            handleInputChange={handleInputChange}
          />
          <hr />
          <button className='btn btn-primary'>Save</button>
          <Link to='/admin' className='btn btn-warning ms-1'>
            Cancel
          </Link>
          {movie.id > 0 && (
            <a href='#!' onClick={handleDelete} className='btn btn-danger ms-1'>
              Delete
            </a>
          )}
        </form>
      </>
    )
  }
}
