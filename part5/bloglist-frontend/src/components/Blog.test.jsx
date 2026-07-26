import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com/',
    likes: 10,
    user: {
      username: 'root',
      name: 'Superuser',
    },
  }

  const renderBlog = user => {
    render(
      <MemoryRouter initialEntries={['/blogs/123']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={<Blog blogs={[blog]} updateBlog={vi.fn()} removeBlog={vi.fn()} user={user} />}
          />
        </Routes>
      </MemoryRouter>
    )
  }

  test('shows blog information and likes to unauthenticated users', () => {
    renderBlog(null)

    expect(screen.getByText('Component testing is done with react-testing-library Full Stack Open')).toBeDefined()
    expect(screen.getByText('https://fullstackopen.com/')).toBeDefined()
    expect(screen.getByText('likes 10')).toBeDefined()
    expect(screen.queryByRole('button')).toBeNull()
  })

  test('shows only like button to a user who did not create the blog', () => {
    renderBlog({ username: 'another-user', name: 'Another user' })

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('shows like and remove buttons to the blog creator', () => {
    renderBlog(blog.user)

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })
})
