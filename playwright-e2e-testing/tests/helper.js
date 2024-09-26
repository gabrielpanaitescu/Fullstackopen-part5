const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("url").fill(url);
  await page.getByRole("button", { name: "create blog" }).click();
  await page.locator("li").getByText(title).waitFor();
};

const likeBlog = async (blogElem, times = 1) => {
  const likeButton = blogElem.getByRole("button", { name: "like" });
  const likesDiv = blogElem.locator(".likesDiv");

  for (let i = 0; i < times; i++) {
    const currentLikes = await likesDiv.textContent();
    await likeButton.click();

    await blogElem.page().waitForFunction(
      ([likesLocator, currentLikesValue]) => {
        const newLikes = likesLocator.textContent().trim();
        return parseInt(newLikes) > parseInt(currentLikesValue);
      },
      [likesDiv, currentLikes]
    );
  }
};

module.exports = {
  loginWith,
  createBlog,
  // likeBlog,
};
