import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

// components
import Home from './components/Home'
import Movies from './components/Movies'
import OneMovie from './components/OneMovie'
import Genres from './components/Genres'
import OneGenre from './components/OneGenre'
import EditMovie from './components/EditMovie'
import Admin from './components/Admin'
import Login from './components/Login'
import GraphQL from './components/GraphQL'
import OneMovieGraphQL from './components/OneMovieGraphQL'

export default function App() {
  const [jwt, setJwt] = useState('')
  const [loginLink, setLoginLink] = useState(null)

  useEffect(() => {
    let t = window.localStorage.getItem('jwt')

    if (t) {
      setJwt(JSON.parse(t))
    }

    if (jwt === '') {
      setLoginLink(<Link to='/login'>Login</Link>)
    } else {
      setLoginLink(
        <Link to='/login' onClick={logout}>
          Logout
        </Link>,
      )
    }
  }, [jwt])

  const handleJwtChange = (jwt) => {
    setJwt(jwt)
  }

  const logout = () => {
    setJwt('')
    window.localStorage.removeItem('jwt')
    // props.history.push({ pathname: '/login' })
    // history.push('/')
  }

  return (
    <Router>
      <div className='container'>
        <div className='row'>
          <div className='col mt-3'>
            <h1 className='mt-3'>Go Watch a Movie!</h1>
          </div>
          <div className='col mt-3 text-end'>{loginLink}</div>
          <hr className='mb-3'></hr>
        </div>

        <div className='row'>
          <div className='col-md-2'>
            <nav>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link to='/'>Home</Link>
                </li>
                <li className='list-group-item'>
                  <Link to='/movies'>Movies</Link>
                </li>
                <li className='list-group-item'>
                  <Link to='/genres'>Genres</Link>
                </li>
                {jwt !== '' && (
                  <>
                    <li className='list-group-item'>
                      <Link to='/admin/movie/0'>Add movie</Link>
                    </li>
                    <li className='list-group-item'>
                      <Link to='/admin'>Manage Catalogue</Link>
                    </li>
                  </>
                )}
                <li className='list-group-item'>
                  <Link to='/graphql'>GraphQL</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className='col-md-10'>
            <Switch>
              <Route path='/movies/:id' component={OneMovie} />
              <Route path='/graphql/movies/:id' component={OneMovieGraphQL} />
              <Route path='/movies' component={Movies} />

              <Route path='/genres/:genre_id' component={OneGenre} />
              <Route exact path='/genres' component={Genres} />

              <Route
                exact
                path='/login'
                component={(props) => (
                  <Login {...props} onJwtChange={handleJwtChange} />
                )}
              />

              <Route
                path='/admin/movie/:id'
                component={(props) => <EditMovie {...props} jwt={jwt} />}
              />
              <Route
                path='/admin'
                component={(props) => <Admin {...props} jwt={jwt} />}
              />

              <Route exact path='/graphql' component={GraphQL} />

              <Route path='/' component={Home} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}
