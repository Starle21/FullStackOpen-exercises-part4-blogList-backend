const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// // CHAINING PROMISES
// blogsRouter.get("/", (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

// ASYNC AWAIT
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  // version 1
  const body = request.body;
  const contentToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    contentToUpdate,
    { runValidators: true, new: true }
  );
  response.json(updatedBlog);

  // // version 2
  // const foundBlog = await Blog.findById(request.params.id);
  // console.log(foundBlog.toJSON());

  // //new object with the new data, if not specified, it takes the old data
  // const body = request.body;
  // foundBlog.likes = body.likes || foundBlog.likes;
  // foundBlog.author = body.author || foundBlog.author;
  // foundBlog.title = body.title || foundBlog.title;
  // foundBlog.url = body.url || foundBlog.url;
  // console.log(foundBlog);

  // const updatedBlog = await foundBlog.save();
  // response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRouter;
