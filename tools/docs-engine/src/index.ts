import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export interface WorkspaceInventory {
  apps: string[];
  packages: string[];
  tools: string[];
}

async function readDirectoryNames(path: string): Promise<string[]> {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

export async function inventoryWorkspace(
  rootDir: string = process.cwd()
): Promise<WorkspaceInventory> {
  const [apps, packages, tools] = await Promise.all([
    readDirectoryNames(join(rootDir, 'apps')),
    readDirectoryNames(join(rootDir, 'packages')),
    readDirectoryNames(join(rootDir, 'tools'))
  ]);

  return { apps, packages, tools };
}
