export interface FailedTest {
  name: string;
  screenshot: string;
  logs: string;
}

export interface FlakyTest {
  name: string;
  retries: number;
  screenshot: string;
  logs: string;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  failedTests: FailedTest[];
  flakyTests: FlakyTest[];
}
