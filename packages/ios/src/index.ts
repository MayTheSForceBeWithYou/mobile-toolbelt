import { Command } from 'commander';

import { registerGenerateIconsCommand } from './commands/icons/generate';

export * from './services/generate-icons';

export function registerIosCommands(program: Command): void {
  const ios = program.command('ios').description('iOS automation commands');
  const icons = ios.command('icons').description('iOS app icon tools');

  registerGenerateIconsCommand(icons);

  ios.command('plist').description('plist utilities').command('inspect').description('Inspect plist files');

  ios.command('version').description('version utilities').command('bump').description('Bump iOS app versions');
}
