export const iosBrowserStack = [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone SE 2022',
    'appium:platformVersion': '15',
    'appium:automationName': 'XCUITest',
    'appium:app': process.env.BS_APP_ID,
  
    'bstack:options': {
      projectName: 'Fabric Code Challenge',
      buildName: `Build-${process.env.GITHUB_RUN_NUMBER || 'local'}`,
      sessionName: 'iOS Appium Tests',
      debug: true,
      networkLogs: true
    }
  }];


// export const iosBrowserStack = (orientation: 'PORTRAIT' | 'LANDSCAPE') => [{
//     platformName: 'iOS',
//     'appium:deviceName': 'iPhone SE 2022',
//     'appium:platformVersion': '15',
//     'appium:automationName': 'XCUITest',
//     'appium:app': process.env.BS_APP_ID,
//     'appium:deviceOrientation': orientation,
//     'bstack:options': {
//       projectName: 'Fabric Code Challenge',
//       buildName: `Build-${process.env.GITHUB_RUN_NUMBER || 'local'}`,
//       sessionName: `iOS Appium Tests - ${orientation}`,
//       debug: true,
//       networkLogs: true
//     }
//   }];