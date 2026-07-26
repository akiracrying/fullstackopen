import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={message.type}>
      {message.text}
    </Alert>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const blog = { ...returnedBlog, user }

      setBlogs(blogs.concat(blog))
      setMessage({ text: `a new blog ${blog.title} by ${blog.author} added`, type: 'success' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      navigate('/')
    } catch {
      setMessage({ text: 'error adding blog', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async blogObject => {
    await blogService.update(blogObject.id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : blogObject))
  }

  const removeBlog = async blogObject => {
    await blogService.remove(blogObject.id)
    setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
    navigate('/')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <Button type="submit" variant="contained">login</Button>
    </form>
  )

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>
          {user === null &&
            <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
          }
          {user !== null &&
            <Button color="inherit" component={Link} to="/create" sx={style}>create new blog</Button>
          }
          {user !== null &&
            <>
              {user.name} logged in
              <Button color="inherit" onClick={handleLogout} sx={style}>logout</Button>
            </>
          }
        </Toolbar>
      </AppBar>

      <Notification message={message} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/login" element={<div><h2>log in to application</h2>{loginForm()}</div>} />
        <Route path="/create" element={user && <BlogForm createBlog={addBlog} />} />
        <Route
          path="/blogs/:id"
          element={<Blog blogs={blogs} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />}
        />
      </Routes>
    </Container>
  )
}

export default App
