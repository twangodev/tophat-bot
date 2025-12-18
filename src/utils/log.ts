import chalk from 'chalk';
import ora, { Ora } from 'ora';
import figlet from 'figlet';

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

export function banner() {
  const ascii = figlet.textSync('TopHat Bot', { font: 'ANSI Shadow' });
  console.log(chalk.hex('#934AF4')(ascii));

  console.log(chalk.yellow.bold('⚠  USE AT YOUR OWN RISK'));
  console.log(chalk.yellow('─'.repeat(50)));
  console.log(chalk.dim('  • Verify this complies with applicable ToS'));
  console.log(chalk.dim('  • You assume all responsibility for usage'));
  console.log(chalk.yellow('─'.repeat(50)));
  console.log();
}