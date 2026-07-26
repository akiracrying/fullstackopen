import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const Blog = ({ blogs, updateBlog, removeBlog, user }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const addLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  return (
    <Card style={{ marginTop: 10 }}>
      <CardContent>
        <h2>{blog.title} {blog.author}</h2>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          {user && <Button onClick={addLike}>like</Button>}
        </div>
        <div>{blog.user.name}</div>
        {user && blog.user.username === user.username &&
          <Button onClick={remove}>remove</Button>
        }
      </CardContent>
    </Card>
  )
}

export default Blog
