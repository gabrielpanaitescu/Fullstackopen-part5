import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm/> calls onSubmit with correct info", async () => {
  const user = userEvent.setup();

  const createBlog = vi.fn();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const titleInput = container.querySelector("#title");
  const authorInput = container.querySelector("#author");
  const urlInput = container.querySelector("#url");

  await user.type(titleInput, "Test title");
  await user.type(authorInput, "Test author");
  await user.type(urlInput, "Test url");

  const submitButton = screen.getByText("create blog");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test title");
  expect(createBlog.mock.calls[0][0].author).toBe("Test author");
  expect(createBlog.mock.calls[0][0].url).toBe("Test url");
});
