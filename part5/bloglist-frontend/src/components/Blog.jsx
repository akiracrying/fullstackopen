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
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible &&
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={addLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && <button onClick={remove}>remove</button>}
        </div>
      }
    </div>
  )
}

export default Blog
