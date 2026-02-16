import * as nodemailer from "nodemailer";
import * as path from "path";
import { AllureHelper } from "../utils/allurehelper";
import * as fs from "fs";

export class EmailHelper {
    static async sendTestReport() {
      const summary = AllureHelper.getTestSummary();
  
      if (summary.total === 0) {
        console.log("No test results found to send.");
        return;
      }
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
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
  
      // Error logs 
      summary.failedTests.forEach((f) => {
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
        <p><strong>Skipped:</strong> ⚠️ ${summary.skipped}</p>
  
        ${
          summary.failedTests.length > 0
            ? `
              <h3>❌ Details of Failed Tests</h3>
              ${summary.failedTests
                .map((f) => {
                  const logPath = f.screenshot.replace(/\.png$/, ".txt");
                  const logLink = fs.existsSync(logPath)
                    ? `<p><strong>Error Log:</strong> <a href="cid:${path.basename(
                        logPath
                      )}">${path.basename(logPath)}</a></p>`
                    : "";
                  return `
                    <div style="margin-bottom:20px">
                      <p><strong>${f.name}</strong></p>
                      <img src="cid:${path.basename(f.screenshot)}" width="400"/>
                      ${logLink}
                    </div>
                  `;
                })
                .join("")}
            `
            : "<p>🎉 No failed tests</p>"
        }
      `;
  
      await transporter.sendMail({
        from: `"Test Automation" <${process.env.USER_EMAIL}>`,
        to: process.env.USER_EMAIL,
        subject: "SwagLabs Automation Test Report",
        html,
        attachments,
      });
  
      console.log("Test report emailed successfully with screenshots and logs!");
    }
  }