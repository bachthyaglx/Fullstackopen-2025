const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { env } = require('node:process')

const api = supertest(app)
// ...

// describe("Unit tests WITHOUT token", () => {
//   test('4.8 Returns the amount of blog posts', async () => {
//     const response = await api.get('/api/blogs')
//     assert.strictEqual(response.body.length, helper.initialBlogs.length)
//   })

//   test('4.9 Unique identifier property of the blog posts is named _id', async () => {
//     const response = await api.get('/api/blogs')
//     const ids = response.body.map(result => result.id)

//     assert.strictEqual(ids.length, helper.initialBlogs.length)
//   })
// })

let token = null

beforeEach(async () => {
  const existingUser = await User.findOne({ username: "bachthyaglx" })
  if (existingUser) {
    // If user already exists, skip creating a new one
    token = jwt.sign({ username: existingUser.username, id: existingUser.id }, process.env.SECRET)
    return
  }

  const passwordHash = await bcrypt.hash("bachthy20fc", 10)
  const newUser = await new User({ username: "bachthyaglx", passwordHash }).save()

  const userForToken = { username: newUser.username, id: newUser.id }
  token = jwt.sign(userForToken, process.env.SECRET)
})

describe("Unit tests WITH token", () => {
  test("4.23* A valid blog can be added by authorized user", async () => {
    const newBlog = {
      title: "A new story",
      author: "Unknown",
      url: "https://www.example.com",
      likes: 5,
    };
  
    // Fetch initial blogs count
    const blogs_start = await helper.blogsInDb();
  
    // Make API request to add a new blog with authorization token
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  
    // Fetch updated blogs count
    const blogs_end = await helper.blogsInDb()
  
    // Assert that the number of blogs has increased by one
    assert.strictEqual(blogs_end.length, blogs_start.length + 1)
    // Additional assertion based on blog content
    assert(blogs_end.some(blog => blog.title === "a blog"))
  })
  
  // assert.strictEqual(end_blogs.length, start_blogs.length + 1)
  // assert(end_blogs.includes('The beauty and the beast'))

  // test('4.11 If likes missing from request, set default to 0', async () => {
  //   const newBlog = {
  //     title: "New Story",
  //     author: "Thy",
  //     url: "http://www.thythy.com",
  //     likes: null
  //   }
    
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)
    
  //   const blogsAtEnd = await helper.blogsInDb()
  //   const foundBlog = blogsAtEnd.find(n => n.title === newBlog.title);

  //   assert.strictEqual(foundBlog.likes, 0)  
  // })

  // test('4.12 If title/url missing, backend responds 400 Bad Request', async () => {
  //   const newBlog = {
  //     title: null,
  //     author: "Unknown",
  //     url: "http://www.thythy.com",
  //     likes: 2
  //   }
    
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(400)
    
  //   const blogsAtEnd = await helper.blogsInDb()

  //   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)  
  // })

  // test('4.13 Delete a blog successfully, status 204', async () => {
  //   const blogsAtStart = await helper.blogsInDb()
  //   const blogToDelete = blogsAtStart[0]

  //   await api
  //     .delete(`/api/blogs/${blogToDelete.id}`)
  //     .expect(204)

  //   const blogsAtEnd = await helper.blogsInDb()

  //   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  //   const titles = blogsAtEnd.map(r => r.title)
  //   assert(!titles.includes(blogToDelete.title))
  // })

  // test('4.14 Succeeds if id is valid', async () => {
  //   const blogsAtStart = await helper.blogsInDb()
  //   const blogToUpdate = blogsAtStart[0]

  //   const updatedBlogData = {
  //     author: 'Khuu Bach Thy',
  //     likes: 10
  //   };

  //   await api
  //     .put(`/api/blogs/${blogToUpdate.id}`)
  //     .send(updatedBlogData)
  //     .expect(200)

  //   const blogsAtEnd = await helper.blogsInDb();
  //   const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);

  //   assert.strictEqual(updatedBlog.author, updatedBlogData.author)
  // })
})

//...

after(async () => {
  await mongoose.connection.close()
})