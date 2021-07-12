const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");

// creates express application
const app = express();

// connecting to database
logger.info("connecting to:", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to mongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to mongoDB:", error.message);
  });

// pre middleware
app.use(cors());
// app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

// routes
app.use("/api/blogs", blogsRouter);

// post middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
