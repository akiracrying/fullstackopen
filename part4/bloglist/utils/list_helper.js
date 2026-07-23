const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((favorite, blog) => {
    if (blog.likes > favorite.likes) {
      return blog
    }

    return favorite
  })
}

const mostBlogs = blogs => {
  const blogCount = {}

  blogs.forEach(blog => {
    if (blogCount[blog.author]) {
      blogCount[blog.author] += 1
    } else {
      blogCount[blog.author] = 1
    }
  })

  const author = Object.keys(blogCount).reduce((mostActiveAuthor, currentAuthor) => {
    if (blogCount[currentAuthor] > blogCount[mostActiveAuthor]) {
      return currentAuthor
    }

    return mostActiveAuthor
  })

  return {
    author,
    blogs: blogCount[author],
  }
}

const mostLikes = blogs => {
  const likes = {}

  blogs.forEach(blog => {
    if (likes[blog.author]) {
      likes[blog.author] += blog.likes
    } else {
      likes[blog.author] = blog.likes
    }
  })

  const author = Object.keys(likes).reduce((mostLikedAuthor, currentAuthor) => {
    if (likes[currentAuthor] > likes[mostLikedAuthor]) {
      return currentAuthor
    }

    return mostLikedAuthor
  })

  return {
    author,
    likes: likes[author],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
