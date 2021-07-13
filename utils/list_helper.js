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

// sum all likes of each author
const mostLikes = (blogs) => {
  // // A version without lodash
  // // take only authors
  // const authors = blogs.map((blog) => {
  //   return { author: blog.author, likes: blog.likes };
  // });
  // const authorLikes = [];

  // // put the same authors together
  // authors.forEach((i) => {
  //   const foundAuthor = authorLikes.find((el) => el.author === i.author);
  //   if (foundAuthor) {
  //     foundAuthor.likes += i.likes;
  //   } else {
  //     authorLikes.push({
  //       author: i.author,
  //       likes: i.likes,
  //     });
  //   }
  // });

  // // take only the author with the most blogs
  // return authorLikes.length === 0
  //   ? {}
  //   : authorLikes.reduce(
  //       (max, author) => {
  //         if (author.likes > max.likes) {
  //           max = author;
  //         }
  //         return max;
  //       },
  //       { author: "", likes: 0 }
  //     );

  //B lodash version
  const grouppedAuthors = lodash.groupBy(blogs, "author");
  const likes = lodash.map(grouppedAuthors, (val, key) => {
    const totalLikes = val.reduce((likes, item) => likes + item.likes, 0);
    return {
      author: key,
      likes: totalLikes,
    };
  });
  return blogs.length === 0 ? {} : lodash.maxBy(likes, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
