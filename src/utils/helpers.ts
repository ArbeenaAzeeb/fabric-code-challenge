import { testContext } from "../context/testContext";

export async function enforceOrientation() {
  const orientation = testContext.orientation;
  const current = await driver.getOrientation();
  if (current !== orientation) {
    await driver.setOrientation(orientation);
  }
}

export class ElementHelpers {
  static async scrollIfNeeded(
    element: ChainablePromiseElement,
    maxAttempts = 30
  ) {
    await element.waitForExist({ timeout: 5000 });

    let attempts = 0;
    const isBrowserStack = process.env.RUN_ENV === "browserstack";

    const { width, height } = await driver.getWindowRect();

    while (!(await element.isDisplayed()) && attempts < maxAttempts) {
      const location = await element.getLocation();
      const size = await element.getSize();

      const needsScrollUp = location.y + size.height > height;
      const needsScrollDown = location.y < 0;

      if (needsScrollUp || needsScrollDown) {
        if (isBrowserStack) {
          await driver.execute("mobile: swipe", {
            direction: needsScrollUp ? "up" : "down",
            velocity: 300,
          });
        } else {
          await driver.execute("mobile: dragFromToForDuration", {
            fromX: Math.floor(width * 0.5),
            fromY: needsScrollUp
              ? Math.floor(height * 0.7)
              : Math.floor(height * 0.3),
            toX: Math.floor(width * 0.5),
            toY: needsScrollUp
              ? Math.floor(height * 0.6)
              : Math.floor(height * 0.4),
            duration: 0.2,
          });
        }
      }
      try {
        await driver.releaseActions();
      } catch (_) {}

      await driver.pause(700);
      attempts++;
    }

    if (!(await element.isDisplayed())) {
      throw new Error("Element not found after scrolling");
    }

    return element;
  }
}
