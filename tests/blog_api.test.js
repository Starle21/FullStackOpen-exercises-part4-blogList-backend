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
  test("with the correct data creates new resource", async () => {
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
  }, 100000);

  test("with likes property missing defaults to likes 0", async () => {
    const newBlogWithoutLikes = {
      title: "Without Likes",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/",
    };
    const savedBlog = await api
      .post("/api/blogs")
      .send(newBlogWithoutLikes)
      .expect(201);

    // // version 1
    // expect(savedBlog.body.likes).toBe(0);

    // version 2
    const addedBlog = await Blog.findById(savedBlog.body.id);
    expect(addedBlog.likes).toEqual(0);
  });

  test("with title and url missing is invalid", async () => {
    const invalidBlog = {
      author: "Robert C. Martin",
    };
    await api.post("/api/blogs").send(invalidBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deleting a blog", () => {
  test("with a valid id succeeds", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const urls = blogsAtEnd.map((r) => r.url);

    expect(urls).not.toContain(blogToDelete.url);
  });

  test("fails with statuscode 400 when id is invalid", async () => {
    const invalidId = "60eebf2455";

    await api.delete(`/api/blogs/${invalidId}`).expect(400);
  });

  test("fails with statuscode 404 when note does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.delete(`/api/notes/${validNonexistingId}`).expect(404);
  });
});

describe("updating a blog", () => {
  test("with correct id and all the required data succeeds", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const contentToUpdate = {
      title: "Updated Blog",
      author: "Updated author",
      url: "http://blog.updated.com/",
      likes: 99,
    };

    const returnedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(contentToUpdate)
      .expect(200);

    const updatedBlog = await Blog.findById(returnedBlog.body.id);
    expect(updatedBlog.likes).toEqual(99);
  });

  test("with correct id but NOT all the required data returns 400", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const invalidContent = {
      title: "Updated Blog",
      author: "Updated author",
      likes: 50,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidContent)
      .expect(400);
  });

  test("with incorrect id returns 400", async () => {
    const invalidId = "60eebf2455";

    const contentToUpdate = {
      title: "Updated Blog",
      author: "Updated author",
      url: "http://blog.updated.com/",
      likes: 99,
    };

    await api.put(`/api/blogs/${invalidId}`).send(contentToUpdate).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
