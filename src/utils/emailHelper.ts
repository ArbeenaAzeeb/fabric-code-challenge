import * as nodemailer from "nodemailer";
import * as path from "path";
import { AllureHelper } from "../utils/allurehelper";

export class EmailHelper {
  static async sendTestReport() {
    const summary = AllureHelper.getTestSummary();

    if (summary.total === 0) {
      console.log("No test results found to send.");
      return;
    }
console.log("email: ",process.env.USER_EMAIL)
console.log("pass: ",process.env.USER_PASS)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,      
        pass: process.env.USER_PASS      
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
            <h3>❌ Failed Tests</h3>
            ${summary.failedTests
              .map(
                (f) => `
                  <div style="margin-bottom:20px">
                    <p><strong>${f.name}</strong></p>
                    <img src="cid:${path.basename(f.screenshot)}" width="400"/>
                  </div>`
              )
              .join("")}
          `
          : "<p>🎉 No failed tests</p>"
      }
    `;

    // Attach screenshots
    const attachments = summary.failedTests.map(f => ({
        filename: path.basename(f.screenshot),      
        path: f.screenshot,                        
        cid: path.basename(f.screenshot),     
      }));

    await transporter.sendMail({
      from: `"Test Automation" <${process.env.EMAIL_USER}>`,
      to: process.env.USER_EMAIL,
      subject: "Automation Test Report",
      html,
      attachments
    });

    console.log("Test report emailed successfully!");
  }
}
