export interface FailedTest {
  name: string;
  screenshot: string;
  logs: string;
}
export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped?: number;
  failedTests: FailedTest[];
}
