import { testContext } from "../context/testContext";

export class ElementHelpers {
    static async scrollIfNeeded(element: ReturnType<typeof $>, maxAttempts = 20) {
        await element.waitForExist({ timeout: 5000 });

        const { height } = await driver.getWindowRect();

        let isVisible = await element.isDisplayed();
        let attempts = 0;

        while (!isVisible && attempts < maxAttempts) {
            // Get element location and size
            const location = await element.getLocation();
            const size = await element.getSize();

            // If element bottom is below screen, scroll a small step
            if (location.y + size.height > height) {
                await driver.execute('mobile: swipe', {
                    direction: 'up',
                    velocity: 200
                });
            } 
            // If element top is above screen, scroll down
            else if (location.y < 0) {
                await driver.execute('mobile: swipe', {
                    direction: 'down',
                    velocity: 250
                });
            }

            await driver.pause(300);
            isVisible = await element.isDisplayed();
            attempts++;
        }

        if (!isVisible) throw new Error('Element not visible after scrolling');

        return element;
    } 
}

export async function enforceOrientation() {
  const orientation = testContext.orientation;
  const current = await driver.getOrientation();
  if (current !== orientation) {
    await driver.setOrientation(orientation);
  }
}

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement,
//     maxAttempts = 30
//   ) {
//     await element.waitForExist({ timeout: 5000 });
//     let attempts = 0;

//     while (!(await element.isDisplayed()) && attempts < maxAttempts) {
//       const location = await element.getLocation();
//       const size = await element.getSize();
//       const { height } = await driver.getWindowRect();
//       if (location.y + size.height > height) {
//         // scroll UP (content moves up, finger moves up)
//         await driver.execute('mobile: dragFromToForDuration', {
//           fromX: 350,
//           fromY: 340,
//           toX: 350,
//           toY: 310,
//           duration: 0.2
//         });
//       } else if (location.y < 0) {
//         // scroll DOWN (content moves down, finger moves down)
//         await driver.execute('mobile: dragFromToForDuration', {
//           fromX: 350,
//           fromY: 270,
//           toX: 350,
//           toY: 340,
//           duration: 0.2
//         });
//       }

//       // Force pointer release, ignore 404 / unsupported on BrowserStack
//       try {
//         await driver.releaseActions();
//       } catch (err) {
//         // ignore WebDriver DELETE /actions failure
//       }

//       await driver.pause(1000);
//       attempts++;
//     }

//     if (!(await element.isDisplayed())) {
//       throw new Error("Element not found after coordinate swipes.");
//     }

//     return element;
//   }
// }
