const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog, likeBlog } = require("./helper");

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

      test("user that created the blog can delete it", async ({ page }) => {
        page.on("dialog", async (dialog) => {
          expect(dialog.type()).toBe("confirm");
          await dialog.accept();
        });

        const targetBlogElem = await page
          .locator("li")
          .filter({ hasText: "First blog" });
        await targetBlogElem.getByRole("button", { name: "show" }).click();
        await targetBlogElem.getByRole("button", { name: "remove" }).click();

        await expect(page.getByText("First blog")).not.toBeVisible();
      });

      test("and logs out and back in using another user, blogs cannot be deleted", async ({
        page,
        request,
      }) => {
        await request.post("/api/users", {
          data: {
            username: "another_test_user",
            password: "test1234!",
            name: "Another test user",
          },
        });

        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "another_test_user", "test1234!");
        const targetBlogElem = await page
          .locator("li")
          .filter({ hasText: "First blog" });

        await targetBlogElem.getByRole("button", { name: "show" }).click();
        await expect(
          targetBlogElem.getByRole("button", { name: "remove" })
        ).not.toBeVisible();
      });

      test("blogs are sorted by the most liked", async ({ page }) => {
        const firstBlogElem = await page
          .locator("li")
          .filter({ hasText: "First blog" });
        await firstBlogElem.getByRole("button", { name: "show" }).click();
        await firstBlogElem.getByRole("button", { name: "like" }).click();
        await expect(firstBlogElem.locator(".likesDiv")).toHaveText("1 like");

        const secondBlogElem = await page
          .locator("li")
          .filter({ hasText: "Second blog" });
        await secondBlogElem.getByRole("button", { name: "show" }).click();
        for (let i = 1; i <= 3; i++) {
          await secondBlogElem.getByRole("button", { name: "like" }).click();
          await expect(secondBlogElem.locator(".likesDiv")).toHaveText(
            `${i} like`
          );
        }

        const thirdBlogElem = await page
          .locator("li")
          .filter({ hasText: "Third blog" });
        await thirdBlogElem.getByRole("button", { name: "show" }).click();
        for (let i = 1; i <= 2; i++) {
          await thirdBlogElem.getByRole("button", { name: "like" }).click();
          await expect(thirdBlogElem.locator(".likesDiv")).toHaveText(
            `${i} like`
          );
        }

        const likesDivArr = await page.evaluate(() => {
          const likesDivCollection = document.querySelectorAll(".likesDiv");
          return Array.from(likesDivCollection).map((elem) =>
            elem.textContent.trim()
          );
        });

        expect(likesDivArr).toEqual(["3 like", "2 like", "1 like"]);
      });
    });
  });
});
