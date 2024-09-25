const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "test_user",
        password: "test1234!",
        name: "Test user created by Playwright",
      },
    });

    await page.goto("/");
  });

  test("login form is shown", async ({ page }) => {
    const formElement = page.locator("form");
    await expect(formElement).toBeVisible();
    await expect(formElement.getByLabel("username")).toBeVisible();
    await expect(formElement.getByLabel("password")).toBeVisible();
    await expect(
      formElement.getByRole("button", { name: "login" })
    ).toBeVisible();
  });

  describe("login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "test_user", "test1234!");

      await expect(
        page.getByText("Test user created by Playwright logged in")
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "test_user", "wrong!");

      const errorTextElem = await page.getByText(
        "invalid username or password"
      );
      await expect(errorTextElem).toBeVisible();
      await expect(errorTextElem).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(
        page.getByText("Test user created by Playwright logged in")
      ).not.toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "test_user", "test1234!");
    });

    test("a new blog can be created", async ({ page }) => {
      createBlog(page, "Test title", "Test author", "Test url");
      await expect(page.locator("li").getByText("Test title")).toBeVisible();
    });

    describe("and several blogs are already created", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "First blog", "Author 1", "Url 1");
        await createBlog(page, "Second blog", "Author 2", "Url 2");
        await createBlog(page, "Third blog", "Author 3", "Url 3");
      });

      test("a blog can be liked", async ({ page }) => {
        const targetBlogElem = await page
          .locator("li")
          .filter({ hasText: "Second blog" });
        await targetBlogElem.getByRole("button", { name: "show" }).click();
        await targetBlogElem.getByRole("button", { name: "like" }).click();
        await expect(targetBlogElem.getByText("1")).toBeVisible();
      });
    });
  });
});
