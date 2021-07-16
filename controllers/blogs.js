const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// // CHAINING PROMISES
// blogsRouter.get("/", (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// ASYNC AWAIT
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  //check body.token matches user.token
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  //find user
  const user = await User.findById(decodedToken.id);

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
