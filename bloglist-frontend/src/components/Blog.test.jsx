import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const updateLikes = vi.fn();

  beforeEach(() => {
    const blog = {
      title: "Testing blog component",
      author: "React testing library",
      url: "link",
      likes: 10,
      user: {
        username: "gabriel",
        name: "Gabriel Panaitescu",
      },
    };

    render(<Blog blog={blog} updateLikes={updateLikes} />);
  });

  test("renders title and author, not url and likes", () => {
    screen.getByText("Testing blog component");
    screen.getByText("React testing library");

    const urlText = screen.queryByText("link");
    const likesText = screen.queryByText("10");

    expect(urlText).toBeNull();
    expect(likesText).toBeNull();
  });

  test("after clicking the show button, url and likes are displayed", async () => {
    const showButton = screen.getByText("show");

    const user = userEvent.setup();
    await user.click(showButton);

    screen.getByText("link");
    screen.getByText("10");
  });

  test("clicking the like button twice, will call the event handler twice", async () => {
    const user = userEvent.setup();

    const showButton = screen.getByText("show");
    await user.click(showButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(updateLikes.mock.calls).toHaveLength(2);
  });
});
