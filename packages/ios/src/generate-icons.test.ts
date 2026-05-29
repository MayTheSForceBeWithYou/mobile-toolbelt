import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  IOS_APP_ICON_SPECS,
  generateIosAppIcons,
} from './services/generate-icons';

async function createPng(path: string, width: number, height: number): Promise<void> {
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 122, b: 255, alpha: 1 },
    },
  })
    .png()
    .toFile(path);
}

describe('generateIosAppIcons', () => {
  it('rejects missing files', async () => {
    await expect(
      generateIosAppIcons({
        inputPath: '/missing/icon.png',
        outputDir: '/tmp/output',
      }),
    ).rejects.toMatchObject({ code: 'INPUT_NOT_FOUND' });
  });

  it('rejects non-PNG files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'mobile-toolbelt-test-'));
    const inputPath = join(root, 'icon.txt');
    await writeFile(inputPath, 'not an image', 'utf8');

    await expect(
      generateIosAppIcons({
        inputPath,
        outputDir: join(root, 'out'),
      }),
    ).rejects.toMatchObject({ code: 'INVALID_FORMAT' });
  });

  it('rejects wrong dimensions', async () => {
    const root = await mkdtemp(join(tmpdir(), 'mobile-toolbelt-test-'));
    const inputPath = join(root, 'icon.png');
    await createPng(inputPath, 512, 512);

    await expect(
      generateIosAppIcons({
        inputPath,
        outputDir: join(root, 'out'),
      }),
    ).rejects.toMatchObject({ code: 'INVALID_DIMENSIONS' });
  });

  it('generates expected icon files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'mobile-toolbelt-test-'));
    const inputPath = join(root, 'icon.png');
    const outputDir = join(root, 'AppIcon.appiconset');

    await createPng(inputPath, 1024, 1024);

    const result = await generateIosAppIcons({ inputPath, outputDir });

    expect(result.generatedIcons).toHaveLength(IOS_APP_ICON_SPECS.length);

    for (const icon of result.generatedIcons) {
      const iconPath = join(outputDir, icon.filename);
      await expect(stat(iconPath)).resolves.toBeTruthy();
    }
  });

  it('generates valid Contents.json', async () => {
    const root = await mkdtemp(join(tmpdir(), 'mobile-toolbelt-test-'));
    const inputPath = join(root, 'icon.png');
    const outputDir = join(root, 'AppIcon.appiconset');

    await createPng(inputPath, 1024, 1024);

    const result = await generateIosAppIcons({ inputPath, outputDir });
    const contents = JSON.parse(await readFile(result.contentsJsonPath, 'utf8')) as {
      images: Array<{ idiom: string; filename: string; scale: string; size: string }>;
      info: { version: number; author: string };
    };

    expect(contents.info).toEqual({ version: 1, author: 'xcode' });
    expect(contents.images).toHaveLength(IOS_APP_ICON_SPECS.length);
    expect(contents.images.some((img) => img.idiom === 'ios-marketing')).toBe(true);
  });
});
