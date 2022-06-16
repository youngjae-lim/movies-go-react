import React, { useState } from 'react'

import Alert from './ui/Alert'
import Input from './form/Input'

export default function Login(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [alert, setAlert] = useState({ type: 'd-none', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client side validation
    let errors = []

    if (email === '') {
      errors.push('email')
    }

    if (password === '') {
      errors.push('password')
    }

    setErrors(errors)

    if (errors.length > 0) {
      return false
    }

    // Get email, password form data
    const data = new FormData(e.target)
    const payload = Object.fromEntries(data.entries())

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    const response = await fetch(
      `http://localhost:4000/v1/signin`,
      requestOptions,
    )

    const json = await response.json()

    if (json.error) {
      setAlert({ type: 'alert-danger', message: json.error.message })
    } else {
      props.onJwtChange(json.response)
      window.localStorage.setItem('jwt', JSON.stringify(json.response))
      props.history.push({ pathname: '/admin' })
    }
  }

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  return (
    <>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />
      <form className='pt-3' onSubmit={handleSubmit}>
        <div>
          <Input
            title={'Email'}
            className={hasError('email') ? 'is-invalid' : ''}
            type={'email'}
            name={'email'}
            handleInputChange={(e) => setEmail(e.target.value)}
            errorDiv={hasError('email') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter a valid email address'}
          />
        </div>
        <div>
          <Input
            title={'Password'}
            className={hasError('password') ? 'is-invalid' : ''}
            type={'password'}
            name={'password'}
            handleInputChange={(e) => setPassword(e.target.value)}
            errorDiv={hasError('password') ? 'text-danger' : 'd-none'}
            errorMsg={'Please enter a password'}
          />
        </div>
        <hr />
        <button className='btn btn-primary'>Login</button>
      </form>
    </>
  )
}
