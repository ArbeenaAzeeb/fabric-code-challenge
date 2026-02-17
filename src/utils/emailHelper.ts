import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import { TestSummary } from '../models/summary';
import { ENV } from '../config/env';

export class EmailHelper {
  static async sendTestReport(summary: TestSummary) {
    if (summary.total === 0) {
      console.log('No test results found to send.');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENV.USER_EMAIL,
        pass: ENV.USER_EMAIL_PASS,
      },
    });

    const attachments: nodemailer.SendMailOptions['attachments'] = [];

    // Screenshots
    summary.failedTests.forEach((f) => {
      if (fs.existsSync(f.screenshot)) {
        attachments.push({
          filename: path.basename(f.screenshot),
          path: f.screenshot,
          cid: path.basename(f.screenshot),
        });
      }
    });
    summary.flakyTests.forEach((f) => {
      if (fs.existsSync(f.screenshot)) {
        attachments.push({
          filename: path.basename(f.screenshot),
          path: f.screenshot,
          cid: path.basename(f.screenshot),
        });
      }
    });

    // Error logs
    summary.failedTests.forEach((f) => {
      if (fs.existsSync(f.logs)) {
        attachments.push({
          filename: path.basename(f.logs),
          path: f.logs,
        });
      }
    });
    summary.flakyTests.forEach((f) => {
      if (fs.existsSync(f.logs)) {
        attachments.push({
          filename: path.basename(f.logs),
          path: f.logs,
        });
      }
    });

    const html = `
        <h2>👩🏻‍💻 Automated Test Report</h2>
        <p><strong>Total:</strong> ${summary.total}</p>
        <p><strong>Passed:</strong> ✅ ${summary.passed}</p>
        <p><strong>Failed:</strong> ❌ ${summary.failed}</p>
        <p><strong>Skipped:</strong> ⛔️ ${summary.skipped}</p>
        <p><strong>Flaky:</strong> ⚠️ ${summary.flaky}</p>
  
        ${
          summary.flakyTests.length > 0
            ? `
              <h3>⚠️ Details of Flaky / Retried Tests</h3>
              <ul>
                ${summary.flakyTests
                  .map((f) => `<li>${f.name} (retried ${f.retries} times)</li>`)
                  .join('')}
              </ul>
            `
            : '<p>🎉 No flaky tests</p>'
        }
          
        ${
          summary.failedTests.length > 0
            ? `
              <h3>❌ Details of Failed Tests</h3>
              ${summary.failedTests
                .map((f) => {
                  const logPath = f.screenshot.replace(/\.png$/, '.txt');
                  const logLink = fs.existsSync(logPath)
                    ? `<p><strong>Error Log:</strong> <a href="cid:${path.basename(
                        logPath,
                      )}">${path.basename(logPath)}</a></p>`
                    : '';
                  return `
                    <div style="margin-bottom:20px">
                      <p><strong>${f.name}</strong></p>
                      <img src="cid:${path.basename(f.screenshot)}" width="400"/>
                      ${logLink}
                    </div>
                  `;
                })
                .join('')}
            `
            : '<p>🎉 No failed tests</p>'
        }
      `;

    await transporter.sendMail({
      from: `"Test Automation" <${ENV.USER_EMAIL}>`,
      to: ENV.USER_EMAIL,
      subject: 'SwagLabs Automation Test Report',
      html,
      attachments,
    });

    console.log('Test report emailed successfully with screenshots and logs!');
  }
}
