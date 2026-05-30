import { Command } from 'commander';
import { z } from 'zod';

import { ToolkitError, logger } from '@mobile-toolbelt/core';

import { generateIosAppIcons } from '../../services/generate-icons';

const generateOptionsSchema = z.object({
  input: z.string().min(1, 'The --input path is required.'),
  output: z.string().min(1, 'The --output path is required.'),
});

interface GenerateOptions {
  input: string;
  output: string;
}

export function registerGenerateIconsCommand(iconsCommand: Command): void {
  iconsCommand
    .command('generate')
    .description('Generate iOS AppIcon.appiconset assets from a 1024x1024 PNG')
    .requiredOption('--input <path>', 'Path to source 1024x1024 PNG icon')
    .requiredOption('--output <path>', 'Path to AppIcon.appiconset output directory')
    .action(async (options: GenerateOptions) => {
      try {
        const parsed = generateOptionsSchema.parse(options);
        const result = await generateIosAppIcons({
          inputPath: parsed.input,
          outputDir: parsed.output,
        });

        logger.info(
          `Generated ${result.generatedIcons.length} icons in ${result.outputDir} and wrote Contents.json.`,
        );
      } catch (error) {
        if (error instanceof ToolkitError) {
          logger.error(`Error (${error.code}): ${error.message}`);
        } else if (error instanceof z.ZodError) {
          logger.error(`Invalid options: ${error.issues.map((issue) => issue.message).join(', ')}`);
        } else {
          logger.error(`Unexpected error: ${(error as Error).message}`);
        }

        process.exitCode = 1;
      }
    });
}
