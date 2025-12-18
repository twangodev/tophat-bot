import chalk from 'chalk';
import ora, { Ora } from 'ora';

export const log = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  dim: (msg: string) => console.log(chalk.dim(msg)),
};

export function spinner(text: string): Ora {
  return ora({ text, color: 'cyan' }).start();
}