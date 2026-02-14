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
    const orientation = testContext.orientation
    console.log(orientation)
    const current = await driver.getOrientation();
    if (current !== orientation) {
        await driver.setOrientation(orientation);
    }
}

export class ElementHelpers {
    static async scrollIfNeeded(element: ChainablePromiseElement, maxAttempts = 30) {
      await element.waitForExist({ timeout: 5000 });
      let attempts = 0;
      
      while (!(await element.isDisplayed()) && attempts < maxAttempts) {
        const location = await element.getLocation();
            const size = await element.getSize();
            const { height } = await driver.getWindowRect();

            // If element bottom is below screen, scroll a small step
            if (location.y + size.height > height) {
        await driver.performActions([
          {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
              { type: 'pointerMove', duration: 0, x: 350, y: 340 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 10 }, 
              { type: 'pointerMove', duration: 200, origin: 'viewport', x: 350, y: 270 },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);
    }
    else if (location.y < 0) {
        await driver.performActions([
            {
              type: 'pointer',
              id: 'finger2',
              parameters: { pointerType: 'touch' },
              actions: [
                { type: 'pointerMove', duration: 0, x: 350, y: 270, origin: 'viewport' }, 
                { type: 'pointerDown', button: 0 },                                        
                { type: 'pause', duration: 10 },
                { type: 'pointerMove', duration: 200, x: 350, y: 340, origin: 'viewport' },
                { type: 'pointerUp', button: 0 }, 
              ],
            },
          ]);
    }
  
        await driver.releaseActions();
        
        await driver.pause(1000); 
        attempts++;
      }
  
      if (!(await element.isDisplayed())) {
        throw new Error('Element not found after coordinate swipes.');
      }
  
      return element;
    }
  }


