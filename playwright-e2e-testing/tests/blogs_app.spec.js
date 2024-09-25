const { test, describe, expect, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    request.post("/api/testing/reset");
    request.post("/api/users", {
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
});
