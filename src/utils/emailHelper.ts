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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password if 2FA enabled
      },
    });

    // Build HTML content
    const html = `
      <h2>Automated Test Report</h2>
      <p><strong>Total tests:</strong> ${summary.total}</p>
      <p><strong>Passed:</strong> ${summary.passed}</p>
      <p><strong>Failed:</strong> ${summary.failed}</p>

      ${
        summary.failedTests.length > 0
          ? `<h3>Failed Tests:</h3>
            <ul>
              ${summary.failedTests
                .map(
                  (f) =>
                    `<li>${f.name} - <a href="cid:${path.basename(
                      f.screenshot
                    )}">Screenshot</a></li>`
                )
                .join("")}
            </ul>`
          : "<p>No failed tests.</p>"
      }
    `;

    // Attach screenshots
    const attachments = summary.failedTests.map((f) => ({
      filename: path.basename(f.screenshot),
      path: path.join(__dirname, "../", f.screenshot),
      cid: path.basename(f.screenshot), // for HTML embedded links
    }));

    await transporter.sendMail({
      from: `"Test Automation" <${process.env.EMAIL_USER}>`,
      to: "arbeena.azeeb@gmail.com", // replace with your recipient
      subject: "Automated Test Report",
      html,
      attachments,
    });

    console.log("Test report emailed successfully!");
  }
}
