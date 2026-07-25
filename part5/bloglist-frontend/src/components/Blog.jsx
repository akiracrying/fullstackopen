import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

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
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={remove}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
