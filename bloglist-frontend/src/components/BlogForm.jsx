const BlogForm = ({
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
  addBlog,
}) => (
  <form onSubmit={addBlog}>
    <div>
      <label htmlFor="title">title: </label>
      <input
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
        id="url"
        name="url"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create blog</button>
  </form>
);

export default BlogForm;
