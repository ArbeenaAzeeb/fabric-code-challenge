import { testContext } from "../context/testContext";

// export class ElementHelpers {
//     static async scrollIfNeeded(element: ReturnType<typeof $>, maxAttempts = 20) {
//         await element.waitForExist({ timeout: 5000 });

//         const { height } = await driver.getWindowRect();

//         let isVisible = await element.isDisplayed();
//         let attempts = 0;

//         while (!isVisible && attempts < maxAttempts) {
//             // Get element location and size
//             const location = await element.getLocation();
//             const size = await element.getSize();

//             // If element bottom is below screen, scroll a small step
//             if (location.y + size.height > height) {
//                 await driver.execute('mobile: swipe', {
//                     direction: 'up',
//                     velocity: 300
//                 });
//             } 
//             // If element top is above screen, scroll down
//             else if (location.y < 0) {
//                 await driver.execute('mobile: swipe', {
//                     direction: 'down',
//                     velocity: 250
//                 });
//             }

//             await driver.pause(300);
//             isVisible = await element.isDisplayed();
//             attempts++;
//         }

//         if (!isVisible) throw new Error('Element not visible after scrolling');

//         return element;
//     } 
// }

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
//       console.log("check: ", location, size,height)
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

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement,
//     maxAttempts = 30
//   ) {
//     await element.waitForExist({ timeout: 5000 });

//     let attempts = 0;
//     const isBrowserStack = process.env.RUN_ENV === 'browserstack';

//     const { width, height } = await driver.getWindowRect();

//     while (!(await element.isDisplayed()) && attempts < maxAttempts) {
//       const location = await element.getLocation();
//       const size = await element.getSize();

//       console.log('check:', location, size, height);

//       const needsScrollUp = location.y + size.height > height;
//       const needsScrollDown = location.y < 0;

//       if (needsScrollUp || needsScrollDown) {
//         if (isBrowserStack) {
//           // 🔥 BrowserStack-safe swipe (orientation aware)
//           await driver.execute('mobile: swipe', {
//             direction: needsScrollUp ? 'up' : 'down',
//             velocity: 300
//           });
//         } else {
//           // ✅ Local / Simulator precise coordinate swipe
//           await driver.execute('mobile: dragFromToForDuration', {
//             fromX: Math.floor(width * 0.5),
//             fromY: needsScrollUp
//               ? Math.floor(height * 0.7)
//               : Math.floor(height * 0.3),
//             toX: Math.floor(width * 0.5),
//             toY: needsScrollUp
//               ? Math.floor(height * 0.6)
//               : Math.floor(height * 0.4),
//             duration: 0.2
//           });
//         }
//       }

//       // Force pointer release (BrowserStack may throw 404)
//       try {
//         await driver.releaseActions();
//       } catch (_) {}

//       await driver.pause(700);
//       attempts++;
//     }

//     if (!(await element.isDisplayed())) {
//       throw new Error('Element not found after scrolling');
//     }

//     return element;
//   }
// }

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement,
//     maxAttempts = 30
//   ) {
//     await element.waitForExist({ timeout: 5000 });

//     let attempts = 0;
//     const isBrowserStack = process.env.RUN_ENV === 'browserstack';
//     const { width, height } = await driver.getWindowRect();

//     while (attempts < maxAttempts) {
//       // ✅ ALWAYS re-evaluate after UI settles
//       await driver.pause(isBrowserStack ? 900 : 300);

//       if (await element.isDisplayed()) {
//         return element; // 🔥 hard stop – prevents extra scroll
//       }

//       const location = await element.getLocation();
//       const size = await element.getSize();

//       console.log('check:', location, size, height);

//       const needsScrollUp = location.y + size.height > height;
//       const needsScrollDown = location.y < 0;

//       if (!(needsScrollUp || needsScrollDown)) {
//         // Element is within viewport but visibility not updated yet
//         return element;
//       }

//       if (isBrowserStack) {
//         await driver.execute('mobile: swipe', {
//           direction: needsScrollUp ? 'up' : 'down',
//           velocity: 250 // slightly slower = more stable
//         });
//         await driver.pause(150);
//       } else {
//         await driver.execute('mobile: dragFromToForDuration', {
//           fromX: Math.floor(width * 0.5),
//           fromY: needsScrollUp
//             ? Math.floor(height * 0.7)
//             : Math.floor(height * 0.3),
//           toX: Math.floor(width * 0.5),
//           toY: needsScrollUp
//             ? Math.floor(height * 0.6)
//             : Math.floor(height * 0.4),
//           duration: 0.2
//         });
//       }

//       try {
//         await driver.releaseActions();
//       } catch (_) {}

//       attempts++;
//     }

//     throw new Error('Element not found after scrolling');
//   }
// }

export class ElementHelpers {
  static async scrollIfNeeded(
    element: ChainablePromiseElement,
    maxAttempts = 20
  ) {
    await element.waitForExist({ timeout: 5000 });

    const isBrowserStack = process.env.RUN_ENV === 'browserstack';
    const { width, height } = await driver.getWindowRect();

    let attempts = 0;
    let scrollDirection: 'up' | 'down' | null = null;

    while (attempts < maxAttempts) {
      await driver.pause(isBrowserStack ? 900 : 300);

      if (await element.isDisplayed()) {
        return element; // ✅ stop immediately
      }

      const { y } = await element.getLocation();
      const { height: elHeight } = await element.getSize();

      // 🔑 Decide direction ONCE
      if (!scrollDirection) {
        if (y + elHeight > height) {
          scrollDirection = 'up';
        } else if (y < 0) {
          scrollDirection = 'down';
        } else {
          return element; // in viewport
        }
      }

      if (isBrowserStack) {
        await driver.execute('mobile: swipe', {
          direction: scrollDirection,
          velocity: 300
        });

        await driver.pause(150); // kill momentum
      } else {
        await driver.execute('mobile: dragFromToForDuration', {
          fromX: Math.floor(width * 0.5),
          fromY: scrollDirection === 'up'
            ? Math.floor(height * 0.7)
            : Math.floor(height * 0.3),
          toX: Math.floor(width * 0.5),
          toY: scrollDirection === 'up'
            ? Math.floor(height * 0.6)
            : Math.floor(height * 0.4),
          duration: 0.2
        });
      }

      try {
        await driver.releaseActions();
      } catch (_) {}

      attempts++;
    }

    throw new Error('Element not found after scrolling');
  }
}

