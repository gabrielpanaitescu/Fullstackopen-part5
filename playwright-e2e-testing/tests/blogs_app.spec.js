const { test, describe, expect, beforeEach } = require("@playwright/test");

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
    test("succeeds with correct credential", async ({ page }) => {
      await page.getByLabel("username").fill("test_user");
      await page.getByLabel("password").fill("test1234!");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("Test user created by Playwright logged in")
      ).toBeVisible();
    });

    test("fails with wrong credential", async ({ page }) => {
      await page.getByLabel("username").fill("test_user");
      await page.getByLabel("password").fill("wrong!");
      await page.getByRole("button", { name: "login" }).click();

      await expect(
        page.getByText("invalid username or password")
      ).toBeVisible();
    });
  });
});
