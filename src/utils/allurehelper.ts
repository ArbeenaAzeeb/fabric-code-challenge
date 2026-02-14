import allure from '@wdio/allure-reporter';
import { Status } from 'allure-js-commons';

export class AllureHelper {
  static step(name: string) {
    allure.startStep(name);
  }

  static endStep(status: Status = Status.PASSED) {
    allure.endStep(status);
  }

  static attachment(name: string, content: string) {
    allure.addAttachment(name, content, 'text/plain');
  }

  static async screenshot(name: string) {
    const screenshot = await driver.takeScreenshot();
    allure.addAttachment(
      name,
      Buffer.from(screenshot, 'base64'),
      'image/png'
    );
  }
}

export async function allureStep<T>(
    name: string,
    action: () => Promise<T>
  ): Promise<T> {
    AllureHelper.step(name);
    try {
      const result = await action();
      AllureHelper.endStep(Status.PASSED);
      return result;
    } catch (err) {
      await AllureHelper.screenshot(`${name} - failure`);
      AllureHelper.endStep(Status.FAILED);
      throw err;
    }
  }
