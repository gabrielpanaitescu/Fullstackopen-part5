import { useState } from "react";

const Blog = ({ blog, updateLikes, children }) => {
  const [show, setShow] = useState(false);

  const blogStyle = {
    listStyle: "none",
    border: "1px solid",
    padding: "7px 14px",
    marginBottom: 10,
  };

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <li style={blogStyle}>
      <div>
        <span data-testid="blogTitle">{blog.title}</span>{" "}
        <span>{blog.author}</span>{" "}
        <button onClick={toggleShow}>{show ? "hide" : "show"}</button>
      </div>
      {show && (
        <>
          <p>{blog.url}</p>
          <div>
            {blog.likes} <button onClick={updateLikes}>like</button>
          </div>
          <p>{blog.user.name}</p>
          {children}
        </>
      )}
    </li>
  );
};

export default Blog;
