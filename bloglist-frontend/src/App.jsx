import { useEffect, useRef, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blog";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState({ message: null });
  const [loginVisible, setLoginVisible] = useState(false);
  const blogFormRef = useRef();

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

  const notifyWith = (message, type = "info") => {
    setInfo({ message, type });

    setTimeout(() => {
      setInfo({ message: null });
    }, 3000);
  };

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
      notifyWith(`logged in as '${user.username}'`);
    } catch (exception) {
      notifyWith(exception.response.data.error, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const newBlog = await blogService.create(blogObject);

    setBlogs(blogs.concat(newBlog));

    notifyWith(
      `a new blog '${newBlog.title}' by '${newBlog.author}' has been added`
    );
  };

  const updateLikesOf = async (blogId) => {
    const blogToUpdate = blogs.find((blog) => blog.id === blogId);

    const updatedBlog = {
      ...blogToUpdate,
      user: blogToUpdate.user.id,
      likes: blogToUpdate.likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(blogId, updatedBlog);
      setBlogs(blogs.map((blog) => (blog.id === blogId ? returnedBlog : blog)));
    } catch (exception) {
      notifyWith(exception.response.data.error, "error");
    }
  };

  const deleteBlog = async ({ id, title, author }) => {
    const confirmation = window.confirm(
      `Remove blog '${title}' by '${author}'`
    );
    if (!confirmation) return;
    try {
      await blogService.deleteItem(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (exception) {
      notifyWith(exception.response.data.error, "error");
    }
  };

  const loginForm = () => {
    const showWhenVisible = { display: loginVisible ? "" : "none" };
    const hideWhenVisible = { display: loginVisible ? "none" : "" };

    return (
      <>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>login</button>
        </div>
      </>
    );
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification info={info} />
      {user === null ? (
        loginForm()
      ) : (
        <>
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <h2>Create new blog</h2>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <ul style={{ padding: 0 }}>
            {sortedBlogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={() => updateLikesOf(blog.id)}
              >
                {user.username === blog.user.username && (
                  <button onClick={() => deleteBlog(blog)}>remove</button>
                )}
              </Blog>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
