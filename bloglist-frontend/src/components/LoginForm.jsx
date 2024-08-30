const LoginForm = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">username </label>
      <input
        id="username"
        name="Username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">password </label>
      <input
        id="password"
        name="Password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
);

export default LoginForm;
