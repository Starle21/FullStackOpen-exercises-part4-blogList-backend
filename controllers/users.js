const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.password || body.password.length < 3) {
    return response.status(400).json({
      error:
        "Password missing or too short. Needs to be at least 3 characters.",
    });
  }

  //hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  //new user based on User model
  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash,
  });

  //save to database
  const savedUser = await user.save();

  //send response
  response.json(savedUser);
});

module.exports = usersRouter;
