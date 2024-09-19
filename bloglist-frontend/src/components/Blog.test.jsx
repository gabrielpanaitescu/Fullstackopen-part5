import { screen, render } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;

  beforeEach(() => {
    const blog = {
      title: "Testing blog component",
      author: "React testing library",
      url: "link",
      likes: 10,
    };

    const updateLikes = vi.fn();

    container = render(
      <Blog blog={blog} updateLikes={updateLikes} />
    ).container;
  });

  test(" renders title and author, not url and likes", () => {
    screen.getByText("Testing blog component");
    screen.getByText("React testing library");

    const urlText = screen.queryByText("link");
    const likesText = screen.queryByText("10");

    expect(urlText).toBeNull();
    expect(likesText).toBeNull();
  });
});
