import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blog";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {}
  };

  return (
    <div>
      {user === null ? (
        <>
          <h2>login in to application</h2>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </>
      ) : (
        <>
          {" "}
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
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
