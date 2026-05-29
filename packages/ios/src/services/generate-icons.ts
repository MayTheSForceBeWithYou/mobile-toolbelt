import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { ToolkitError, fileExists } from '@mobile-toolbelt/core';
import { formatOutputPath } from '@mobile-toolbelt/shared';
import sharp from 'sharp';

export interface IosAppIconSpec {
  idiom: 'iphone' | 'ipad' | 'ios-marketing';
  size: string;
  scale: number;
}

export interface GeneratedIcon {
  filename: string;
  idiom: IosAppIconSpec['idiom'];
  size: string;
  scale: number;
  pixels: number;
}

export interface GenerateIosIconsInput {
  inputPath: string;
  outputDir: string;
}

export interface GenerateIosIconsResult {
  sourceFile: string;
  outputDir: string;
  generatedIcons: GeneratedIcon[];
  contentsJsonPath: string;
}

export const IOS_APP_ICON_SPECS: IosAppIconSpec[] = [
  { idiom: 'iphone', size: '20x20', scale: 2 },
  { idiom: 'iphone', size: '20x20', scale: 3 },
  { idiom: 'iphone', size: '29x29', scale: 2 },
  { idiom: 'iphone', size: '29x29', scale: 3 },
  { idiom: 'iphone', size: '40x40', scale: 2 },
  { idiom: 'iphone', size: '40x40', scale: 3 },
  { idiom: 'iphone', size: '60x60', scale: 2 },
  { idiom: 'iphone', size: '60x60', scale: 3 },
  { idiom: 'ipad', size: '20x20', scale: 1 },
  { idiom: 'ipad', size: '20x20', scale: 2 },
  { idiom: 'ipad', size: '29x29', scale: 1 },
  { idiom: 'ipad', size: '29x29', scale: 2 },
  { idiom: 'ipad', size: '40x40', scale: 1 },
  { idiom: 'ipad', size: '40x40', scale: 2 },
  { idiom: 'ipad', size: '76x76', scale: 1 },
  { idiom: 'ipad', size: '76x76', scale: 2 },
  { idiom: 'ipad', size: '83.5x83.5', scale: 2 },
  { idiom: 'ios-marketing', size: '1024x1024', scale: 1 },
];

function iconSizeToPixels(size: string, scale: number): number {
  const [baseSize] = size.split('x');
  const points = Number.parseFloat(baseSize);
  return Math.round(points * scale);
}

function buildFilename(spec: IosAppIconSpec): string {
  const safeSize = spec.size.replace('.', '_');
  return `icon-${spec.idiom}-${safeSize}@${spec.scale}x.png`;
}

export async function generateIosAppIcons(
  input: GenerateIosIconsInput,
): Promise<GenerateIosIconsResult> {
  const exists = await fileExists(input.inputPath);
  if (!exists) {
    throw new ToolkitError('INPUT_NOT_FOUND', `Input file does not exist: ${input.inputPath}`);
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(input.inputPath).metadata();
  } catch (error) {
    throw new ToolkitError('INVALID_FORMAT', 'Input file must be a PNG image.', {
      cause: (error as Error).message,
    });
  }
  if (metadata.format !== 'png') {
    throw new ToolkitError('INVALID_FORMAT', 'Input file must be a PNG image.');
  }

  if (metadata.width !== 1024 || metadata.height !== 1024) {
    throw new ToolkitError('INVALID_DIMENSIONS', 'Input PNG must be exactly 1024x1024 pixels.', {
      width: metadata.width,
      height: metadata.height,
    });
  }

  const outputDir = formatOutputPath(input.outputDir);
  await mkdir(outputDir, { recursive: true });

  const generatedIcons: GeneratedIcon[] = [];

  for (const spec of IOS_APP_ICON_SPECS) {
    const pixels = iconSizeToPixels(spec.size, spec.scale);
    const filename = buildFilename(spec);
    const targetPath = join(outputDir, filename);

    await sharp(input.inputPath).resize(pixels, pixels).png().toFile(targetPath);

    generatedIcons.push({
      filename,
      idiom: spec.idiom,
      size: spec.size,
      scale: spec.scale,
      pixels,
    });
  }

  const contents = {
    images: generatedIcons.map((icon) => ({
      idiom: icon.idiom,
      filename: icon.filename,
      scale: `${icon.scale}x`,
      size: icon.size,
    })),
    info: {
      version: 1,
      author: 'xcode',
    },
  };

  const contentsJsonPath = join(outputDir, 'Contents.json');
  await writeFile(contentsJsonPath, `${JSON.stringify(contents, null, 2)}\n`, 'utf8');

  return {
    sourceFile: basename(input.inputPath),
    outputDir,
    generatedIcons,
    contentsJsonPath,
  };
}
