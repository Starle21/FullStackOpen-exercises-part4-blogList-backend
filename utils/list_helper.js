const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce(
        (max, blog) => {
          if (blog.likes > max.likes) {
            max.title = blog.title;
            max.author = blog.author;
            max.likes = blog.likes;
          }
          return max;
        },
        { title: "", author: "", likes: 0 }
      );
};

//author who has the largest amount of blogs
const mostBlogs = (blogs) => {
  // // A version without lodash
  // // take only authors
  // const authors = blogs.map((blog) => {
  //   return { author: blog.author };
  // });
  // const authorBlog = [];

  // // put the same authors together
  // authors.forEach((i) => {
  //   const foundAuthor = authorBlog.find((el) => el.author === i.author);
  //   if (foundAuthor) {
  //     foundAuthor.blogs++;
  //   } else {
  //     authorBlog.push({
  //       author: i.author,
  //       blogs: 1,
  //     });
  //   }
  // });

  // // take only the author with the most blogs
  // return authorBlog.length === 0
  //   ? {}
  //   : authorBlog.reduce(
  //       (max, author) => {
  //         if (author.blogs > max.blogs) {
  //           max = author;
  //         }
  //         return max;
  //       },
  //       { author: "", blogs: 0 }
  //     );

  // B lodash version
  const occurence = lodash.countBy(blogs, "author");
  const mapped = lodash.map(occurence, (val, key) => ({
    author: key,
    blogs: val,
  }));
  return blogs.length === 0 ? {} : lodash.maxBy(mapped, "blogs");
};

const mostLikes = (blogs) => {
  // sum likes of all authors
  // [{author, likes},{author, likes}]
  // return author with max total likes
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
