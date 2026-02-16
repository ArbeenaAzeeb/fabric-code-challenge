import AllureReporter from "@wdio/allure-reporter";
import * as fs from "fs";
import * as path from "path";

export class AllureHelper {
  static step(name: string) {
    AllureReporter.addStep(name);
  }

  static attachment(name: string, content: string) {
    AllureReporter.addAttachment(name, content, "text/plain");
  }

  static getTestSummary() {
    const resultsDir = path.join(__dirname, "../../allure-results");

    if (!fs.existsSync(resultsDir)) {
      return { total: 0, passed: 0, failed: 0, failedTests: [] };
    }

    const files = fs.readdirSync(resultsDir);
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const failedTests: { name: string; screenshot: string }[] = [];

    files.forEach((file: string) => {
      if (file.endsWith("-result.json")) {
        const filePath = path.join(resultsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        total++;
        if (data.status === "passed") {
          passed++;
        } else if (data.status === "skipped") {
          skipped++;
        } else {
          failed++;
          failedTests.push({
            name: data.name,
            screenshot: path.join(
              "allure-results",
              `${data.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.png`
            ),
          });
        }
      }
    });

    return { total, passed, failed, skipped, failedTests };
  }
}
