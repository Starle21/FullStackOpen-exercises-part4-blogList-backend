const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce(
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
