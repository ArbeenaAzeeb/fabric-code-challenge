import { testContext } from "../context/testContext";

export async function enforceOrientation() {
  const orientation = testContext.orientation;
  console.log(orientation);
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

    while (!(await element.isDisplayed()) && attempts < maxAttempts) {
      const location = await element.getLocation();
      const size = await element.getSize();
      const { height } = await driver.getWindowRect();
      if (location.y + size.height > height) {
        // scroll UP (content moves up, finger moves up)
        await driver.execute('mobile: dragFromToForDuration', {
          fromX: 350,
          fromY: 340,
          toX: 350,
          toY: 265,
          duration: 0.2
        });
      } else if (location.y < 0) {
        // scroll DOWN (content moves down, finger moves down)
        await driver.execute('mobile: dragFromToForDuration', {
          fromX: 350,
          fromY: 270,
          toX: 350,
          toY: 340,
          duration: 0.2
        });
      }

      await driver.releaseActions();

      await driver.pause(1000);
      attempts++;
    }

    if (!(await element.isDisplayed())) {
      throw new Error("Element not found after coordinate swipes.");
    }

    return element;
  }
}
