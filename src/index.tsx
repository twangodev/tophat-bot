import React from 'react';
import { render } from 'ink';
import { Bot } from '@/bot';
import { Banner } from '@/ui/Banner';
import { log } from '@/utils/log';

async function main() {
  const { unmount, waitUntilExit } = render(React.createElement(Banner));
  await new Promise((r) => setTimeout(r, 100)); // Let banner render
  unmount();

  const bot = new Bot();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    log.dim('\nShutting down...');
    await bot.stop();
    process.exit(0);
  });

  await bot.start();
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
