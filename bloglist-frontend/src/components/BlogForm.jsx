import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (e) => {
    e.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">title: </label>
        <input
          required
          id="title"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author: </label>
        <input
          id="author"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url: </label>
        <input
          required
          id="url"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit" data-testid="blog-submit-button">
        create blog
      </button>
    </form>
  );
};

export default BlogForm;
