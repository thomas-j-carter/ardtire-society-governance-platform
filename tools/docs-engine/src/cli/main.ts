#!/usr/bin/env node

import { inventoryWorkspace } from '../index.js';

async function main() {
  const command = process.argv[2] ?? 'inventory';

  if (command !== 'inventory') {
    console.error(
      `Unknown command "${command}". Supported commands: inventory`
    );
    process.exitCode = 1;
    return;
  }

  const inventory = await inventoryWorkspace();
  console.log(JSON.stringify(inventory, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
