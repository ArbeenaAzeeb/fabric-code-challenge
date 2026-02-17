import AllureReporter from '@wdio/allure-reporter';
import * as fs from 'fs';
import * as path from 'path';
import { FailedTest, FlakyTest, TestSummary } from '../models/summary';

export class AllureHelper {
  static step(name: string) {
    AllureReporter.addStep(name);
  }

  static attachment(name: string, content: string) {
    AllureReporter.addAttachment(name, content, 'text/plain');
  }

  static getTestSummary(): TestSummary {
    const resultsDir = path.join(__dirname, '../../allure-results');
    if (!fs.existsSync(resultsDir)) {
      return {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        flaky: 0,
        failedTests: [],
        flakyTests: [],
      };
    }

    const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('-result.json'));

    // Unique test identifier → all attempts
    const testAttempts = new Map<string, any[]>();

    files.forEach((file) => {
      const filePath = path.join(resultsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const testId = `${data.fullName}-${data.parameters?.map((p: any) => p.value).join('-') ?? ''}`;

      if (!testAttempts.has(testId)) testAttempts.set(testId, []);
      testAttempts.get(testId)?.push(data);
    });

    let total = 0,
      passed = 0,
      failed = 0,
      skipped = 0,
      flaky = 0;
    const failedTests: FailedTest[] = [];
    const flakyTests: FlakyTest[] = [];

    for (const [testId, attempts] of testAttempts.entries()) {
      total++;

      const lastAttempt = attempts[attempts.length - 1]; // final attempt determines outcome

      if (lastAttempt.status === 'passed') {
        if (attempts.length > 1) {
          // Flaky: failed first attempt but passed finally
          flaky++;
          flakyTests.push({
            name: lastAttempt.name,
            retries: attempts.length - 1,
            screenshot: path.join(
              'allure-results',
              `${AllureHelper.sanitizeName(lastAttempt.name)}.png`,
            ),
            logs: path.join('logs', `${AllureHelper.sanitizeName(lastAttempt.name)}.txt`),
          });
        }
        passed++;
      } else if (lastAttempt.status === 'skipped') {
        skipped++;
      } else {
        // Failed even after retries
        failed++;
        failedTests.push({
          name: lastAttempt.name,
          screenshot: path.join('allure-results', `${this.sanitizeName(lastAttempt.name)}.png`),
          logs: path.join('logs', `${this.sanitizeName(lastAttempt.name)}.txt`),
        });
      }
    }

    return { total, passed, failed, skipped, flaky, failedTests, flakyTests };
  }

  static sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  }
}

export default AllureHelper;
