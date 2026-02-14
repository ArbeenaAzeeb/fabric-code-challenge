import AllureReporter from '@wdio/allure-reporter';

export class AllureHelper {
    static step(name: string) {
        AllureReporter.addStep(name);
    }

    static attachment(name: string, content: string) {
        AllureReporter.addAttachment(name, content, 'text/plain');
    }
}
