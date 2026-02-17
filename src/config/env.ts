function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const ENV = {
  LOCKED_USER: getEnv('LOCKED_USER'),
  STANDARD_USER: getEnv('STANDARD_USER'),
  USER_PASSWORD: getEnv('USER_PASSWORD'),
  USER_EMAIL: getEnv('USER_EMAIL'),
  USER_EMAIL_PASS: getEnv('USER_EMAIL_PASS'),
  BS_APP_ID: getEnv('BS_APP_ID'),
};
