import { Bot } from './bot';
import { banner, log } from './utils/log';

async function main() {
  banner();

  const bot = new Bot();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    log.dim('\nShutting down...');
    await bot.stop();
    process.exit(0);
  });

  await bot.start();

  // Keep process alive
  log.dim('Press Ctrl+C to exit');
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});
