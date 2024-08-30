import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blog";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {}
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const addBlog = async (e) => {
    e.preventDefault();
    const newBlog = await blogService.create({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    });

    setBlogs(blogs.concat(newBlog));
    setBlogTitle("");
    setBlogAuthor("");
    setBlogUrl("");
  };

  return (
    <div>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <>
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <BlogForm
            title={blogTitle}
            setTitle={setBlogTitle}
            author={blogAuthor}
            setAuthor={setBlogAuthor}
            url={blogUrl}
            setUrl={setBlogUrl}
            addBlog={addBlog}
          />
          <ul>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
