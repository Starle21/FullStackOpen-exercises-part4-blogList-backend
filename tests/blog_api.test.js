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

describe("adding a new blog", () => {
  test.only("with the correct data creates new resource", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newBlogAdded = await helper.blogsInDB();
    expect(newBlogAdded).toHaveLength(helper.initialBlogs.length + 1);

    const titles = newBlogAdded.map((i) => i.title);
    expect(titles).toContain("First class tests");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
