export const iosBrowserStack = [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone SE (3rd generation)',
    'appium:platformVersion': '16',
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
  