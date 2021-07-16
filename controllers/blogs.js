const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const userExtractor = require("../utils/middleware").userExtractor;

// // CHAINING PROMISES
// blogsRouter.get("/", (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

// ASYNC AWAIT
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// not updated to include token authorization
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

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  //token from request request.token
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(400).json({
      error: "blog has been already deleted",
    });
  }

  if (!(user.id === blog.user.toString())) {
    return response.status(401).json({
      error:
        "Only the creator of the blog info can delete it. You are not the creator.",
    });
  }

  await blog.remove();
  response.status(204).end();
});

module.exports = blogsRouter;
