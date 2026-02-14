import { testContext } from "../context/testContext";

export class ElementHelpers {
    static async scrollIfNeeded(element: ReturnType<typeof $>, maxAttempts = 20) {
        await element.waitForExist({ timeout: 5000 });

        const { height, width } = await driver.getWindowRect();

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
                    velocity: 300
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
    const orientation = testContext.orientation
    const current = await driver.getOrientation();
    if (current !== orientation) {
        await driver.setOrientation(orientation);
    }
}

// export class ElementHelpers {
//     static async scrollIfNeeded(
//         element: ReturnType<typeof $>,
//         maxAttempts = 15
//       ) {
//         await element.waitForExist({ timeout: 5000 });
      
//         const orientation = await driver.getOrientation();
//         let attempts = 0;
      
//         while (!(await element.isDisplayed()) && attempts < maxAttempts) {
//           if (orientation === 'LANDSCAPE') {
//             // Horizontal-first in landscape
//             await driver.execute('mobile: swipe', {
//               direction: 'left',
//               velocity: 300
//             });
//           } else {
//             // Vertical-first in portrait
//             await driver.execute('mobile: swipe', {
//               direction: 'up',
//               velocity: 300
//             });
//           }
      
//           await driver.pause(250);
//           attempts++;
//         }
      
//         if (!(await element.isDisplayed())) {
//           throw new Error('Element not visible after scrolling');
//         }
      
//         return element;
//       }      
// }


