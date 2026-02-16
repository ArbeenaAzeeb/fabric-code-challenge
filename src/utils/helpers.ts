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
    const isBrowserStack = process.env.RUN_ENV === 'browserstack';

    const { width, height } = await driver.getWindowRect();

    while (!(await element.isDisplayed()) && attempts < maxAttempts) {
      const location = await element.getLocation();
      const size = await element.getSize();

      console.log('check:', location, size, height);

      const needsScrollUp = location.y + size.height > height;
      const needsScrollDown = location.y < 0;

      if (needsScrollUp || needsScrollDown) {
        if (isBrowserStack) {
          // 🔥 BrowserStack-safe swipe (orientation aware)
          await driver.execute('mobile: swipe', {
            direction: needsScrollUp ? 'up' : 'down',
            velocity: 300
          });
        } else {
          // ✅ Local / Simulator precise coordinate swipe
          await driver.execute('mobile: dragFromToForDuration', {
            fromX: Math.floor(width * 0.5),
            fromY: needsScrollUp
              ? Math.floor(height * 0.7)
              : Math.floor(height * 0.3),
            toX: Math.floor(width * 0.5),
            toY: needsScrollUp
              ? Math.floor(height * 0.6)
              : Math.floor(height * 0.4),
            duration: 0.2
          });
        }
      }

      // Force pointer release (BrowserStack may throw 404)
      try {
        await driver.releaseActions();
      } catch (_) {}

      await driver.pause(700);
      attempts++;
    }

    if (!(await element.isDisplayed())) {
      throw new Error('Element not found after scrolling');
    }

    return element;
  }
}

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

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement,
//     maxAttempts = 20
//   ) {
//     await element.waitForExist({ timeout: 5000 });

//     const isBrowserStack = process.env.RUN_ENV === 'browserstack';
//     const { width, height } = await driver.getWindowRect();

//     let attempts = 0;
//     let scrollDirection: 'up' | 'down' | null = null;

//     while (attempts < maxAttempts) {
//       await driver.pause(isBrowserStack ? 900 : 300);

//       if (await element.isDisplayed()) {
//         return element; // ✅ stop immediately
//       }

//       const { y } = await element.getLocation();
//       const { height: elHeight } = await element.getSize();

//       // 🔑 Decide direction ONCE
//       if (!scrollDirection) {
//         if (y + elHeight > height) {
//           scrollDirection = 'up';
//         } else if (y < 0) {
//           scrollDirection = 'down';
//         } else {
//           return element; // in viewport
//         }
//       }

//       if (isBrowserStack) {
//         await driver.execute('mobile: swipe', {
//           direction: scrollDirection,
//           velocity: 300
//         });

//         await driver.pause(150); // kill momentum
//       } else {
//         await driver.execute('mobile: dragFromToForDuration', {
//           fromX: Math.floor(width * 0.5),
//           fromY: scrollDirection === 'up'
//             ? Math.floor(height * 0.7)
//             : Math.floor(height * 0.3),
//           toX: Math.floor(width * 0.5),
//           toY: scrollDirection === 'up'
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

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement,
//     maxAttempts = 12
//   ) {
//     await element.waitForExist({ timeout: 5000 });

//     const isBrowserStack = process.env.RUN_ENV === 'browserstack';
//     const { width, height } = await driver.getWindowRect();

//     let attempts = 0;
//     let scrollDirection: 'up' | 'down' | null = null;

//     while (attempts < maxAttempts) {
//       // Let UI settle (critical on BS)
//       await driver.pause(isBrowserStack ? 600 : 300);

//       // Hard stop as soon as visible
//       if (await element.isDisplayed()) {
//         return element;
//       }

//       const location = await element.getLocation();
//       const size = await element.getSize();

//       // Decide direction ONCE
//       if (!scrollDirection) {
//         if (location.y + size.height > height) {
//           scrollDirection = 'up';
//         } else if (location.y < 0) {
//           scrollDirection = 'down';
//         } else {
//           return element;
//         }
//       }

//       if (isBrowserStack) {
//         // 🔑 ONE swipe only — no correction, no brake
//         await driver.execute('mobile: swipe', {
//           direction: scrollDirection,
//           velocity: 300
//         });

//         // Short settle only (no momentum chaining)
//         await driver.pause(120);
//       } else {
//         await driver.execute('mobile: dragFromToForDuration', {
//           fromX: Math.floor(width * 0.5),
//           fromY:
//             scrollDirection === 'up'
//               ? Math.floor(height * 0.7)
//               : Math.floor(height * 0.3),
//           toX: Math.floor(width * 0.5),
//           toY:
//             scrollDirection === 'up'
//               ? Math.floor(height * 0.6)
//               : Math.floor(height * 0.4),
//           duration: 0.2
//         });
//       }

//       attempts++;
//     }

//     throw new Error('Element not found after scrolling');
//   }
// }

// export class ElementHelpers {
//   static async scrollIfNeeded(
//     element: ChainablePromiseElement
//   ) {
//     await element.waitForExist({ timeout: 5000 });

//     const isBrowserStack = process.env.RUN_ENV === 'browserstack';

//     // 🟢 BrowserStack → NO swipe
//     if (isBrowserStack) {
//       await driver.execute('mobile: scroll', {
//         element: element.elementId,
//         toVisible: true
//       });
//       return element;
//     }

//     // 🟢 Local fallback
//     if (!(await element.isDisplayed())) {
//       await driver.execute('mobile: dragFromToForDuration', {
//         fromX: 200,
//         fromY: 500,
//         toX: 200,
//         toY: 300,
//         duration: 0.25
//       });
//     }

//     return element;
//   }
// }


