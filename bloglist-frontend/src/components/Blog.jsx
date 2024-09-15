import { useState } from "react";

const Blog = ({ blog, updateLikes }) => {
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
        {blog.title} {blog.author} <button onClick={toggleShow}>show</button>
      </div>
      {show && (
        <>
          <p>{blog.url}</p>
          <div>
            {blog.likes} <button onClick={updateLikes}>like</button>
          </div>
          <p>{blog.user.name}</p>
          <button onClick={toggleShow}>hide</button>
        </>
      )}
    </li>
  );
};

export default Blog;
