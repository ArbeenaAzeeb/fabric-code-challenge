import AllureReporter from '@wdio/allure-reporter';
import * as fs from 'fs';
import * as path from 'path';
import { FailedTest, TestSummary } from '../models/summary';

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
      return { total: 0, passed: 0, failed: 0, skipped: 0, failedTests: [] };
    }

    const files = fs.readdirSync(resultsDir);
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const failedTests: FailedTest[] = [];

    files.forEach((file: string) => {
      if (file.endsWith('-result.json')) {
        const filePath = path.join(resultsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        total++;
        if (data.status === 'passed') {
          passed++;
        } else if (data.status === 'skipped') {
          skipped++;
        } else {
          failed++;
          failedTests.push({
            name: data.name,
            screenshot: path.join('allure-results', `${this.sanitizeName(data.name)}.png`),
            logs: path.join('logs', `${this.sanitizeName(data.name)}.txt`),
          });
        }
      }
    });

    return { total, passed, failed, skipped, failedTests };
  }

  static sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  }
}

export default AllureHelper;
