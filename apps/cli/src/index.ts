#!/usr/bin/env node
import { Command } from 'commander';

import { registerAndroidCommands } from '@mobile-toolbelt/android';
import { registerIosCommands } from '@mobile-toolbelt/ios';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('mobile-toolbelt')
    .description('Reusable cross-platform mobile app automation CLI')
    .version('0.1.0');

  registerIosCommands(program);
  registerAndroidCommands(program);

  await program.parseAsync(process.argv);
}

void main();
