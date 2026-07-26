const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.getByRole('alert')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'Matti Luukkainen', 'https://fullstackopen.com')

      await expect(page.getByRole('link', { name: 'a blog created by playwright' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog to like', 'Matti Luukkainen', 'https://fullstackopen.com')
      await page.getByRole('link', { name: 'a blog to like' }).click()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      await createBlog(page, 'a blog to delete', 'Matti Luukkainen', 'https://fullstackopen.com')
      await page.getByRole('link', { name: 'a blog to delete' }).click()
      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByRole('link', { name: 'a blog to delete' })).not.toBeVisible()
    })

    test('only the user who created a blog sees its delete button', async ({ page, request }) => {
      await createBlog(page, 'a blog by Matti', 'Matti Luukkainen', 'https://fullstackopen.com')
      await request.post('/api/users', {
        data: {
          name: 'Arto Hellas',
          username: 'arto',
          password: 'salainen',
        },
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'arto', 'salainen')
      await page.getByRole('link', { name: 'a blog by Matti' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
