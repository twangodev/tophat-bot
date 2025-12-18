import * as path from 'path';

export const config = {
  cdpPort: 9222,
  targetUrl: 'https://app.tophat.com/e',
  loginUrlPattern: /login|signin|auth/i,
  chromeFlags: [
    '--disable-gpu',
    `--user-data-dir=${path.resolve(process.cwd(), '.browser-profile')}`,
  ],
};
