# 📱 SwagLabs Mobile Test Automation Framework

This repository contains mobile automation test scripts for the SwagLabs iOS application, built using **_Appium, TypeScript, and WebdriverIO_**. Tests are executed using BrowserStack.

## Prerequisites

- Node.js installed
- npm installed
- Appium setup
- BrowserStack account
- iOS app uploaded to BrowserStack

## Running Tests

To run all tests, navigate to the project directory and execute:
`npm test`

To run tests with Allure report generation:
`npm run test:allure`

To open the generated Allure report:
`npm run allure:open`

To run a specific test file, replace the command with the path to the test file:
`npx wdio run wdio.conf.ts --spec <test-file-path> `

## Framework Architecture

### Screens (Page Objects)

All screen classes are located in the screens folder.
Screen classes abstract the mobile UI and provide reusable methods to interact with and verify app functionality.
They enable readable, maintainable, and consistent test flows.
This keeps test scripts concise and focused on user journeys rather than implementation details.

### Tests

All test cases are grouped under the specs folder.
Each spec file represents a complete user flow such as login, shopping, checkout, and logout.

### Test Data

Static test data is maintained under the constants folder.
Checkout users, products, and orientations are centrally defined and reused across tests

### Orientation Handling

Tests are executed in Portrait and Landscape device orientations.

## Utilities

### Reporting

Allure is used for reporting:

- Test steps are logged explicitly
- Screenshots and logs are captured for failed tests
- A summary of total, passed, failed, and skipped tests is generated after execution

### Email Reporting

After test execution, an automated email is sent containing:

- Execution summary
- Failed test details
- Screenshots and error logs (if any)

### Environment Configuration

Environment variables are managed using a .env file and loaded centrally.
Sensitive data such as credentials and BrowserStack details are not committed to the repository.

### Code Formatting

Prettier is used for consistent code formatting.
Formatting is automatically enforced before every commit.
