const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(helper.initialBlogs);
});

describe("getting initial blogs when the db is not empty", () => {
  test("blogs returned in JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("getting all inital blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test("unique identifier property is named id", async () => {
    // const response = await api.get("/api/blogs");
    // console.log(response.body[0]);
    // expect(response.body[0].id).toBeDefined();
    // for (blog of response.body) {
    //   expect(blog.id).toBeDefined();
    // }

    const blogsInitial = await helper.blogsInDB();
    const blogToCheck = blogsInitial[0];
    expect(blogToCheck.id).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
