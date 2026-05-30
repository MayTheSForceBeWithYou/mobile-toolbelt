import { Command } from 'commander';

export function registerAndroidCommands(program: Command): void {
  const android = program.command('android').description('Android automation commands');
  const icons = android.command('icons').description('Android icon utilities');

  icons
    .command('generate')
    .description('Generate Android launcher icons (planned)')
    .action(() => {
      console.log('Android icon generation is planned for a future release.');
    });
}
