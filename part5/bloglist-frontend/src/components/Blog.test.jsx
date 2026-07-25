import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com/',
    likes: 10,
    user: {
      username: 'root',
      name: 'Superuser',
    },
  }

  test('renders title and author, but not url or likes by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        updateBlog={vi.fn()}
        removeBlog={vi.fn()}
        user={blog.user}
      />
    )

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent('Component testing is done with react-testing-library')
    expect(div).toHaveTextContent('Full Stack Open')
    expect(div).not.toHaveTextContent('https://fullstackopen.com/')
    expect(div).not.toHaveTextContent('likes 10')
  })

  test('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        updateBlog={vi.fn()}
        removeBlog={vi.fn()}
        user={blog.user}
      />
    )

    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://fullstackopen.com/')).toBeDefined()
    expect(screen.getByText('likes 10')).toBeDefined()
  })

  test('clicking like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
        removeBlog={vi.fn()}
        user={blog.user}
      />
    )

    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
