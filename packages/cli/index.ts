#!/usr/bin/env bun
import fs from "fs/promises";
import path from "path";
import { Command } from "packages/cli/command";

async function runCommandInFileNamed(fileName: string) {
  const mod = await import(fileName);
  const CommandClass = mod.default;

  if (!(CommandClass.prototype instanceof Command)) {
    console.error(
      `The command ${commandName} does not extend the Command class`
    );
    return;
  }

  const commandInstance = new CommandClass(commandArgs);
  await commandInstance.handle();
  process.exit(0);
}

const args = process.argv.slice(2);

// All the folders we expect to hold commands
const commandResolutionDirs = [
  "node_modules/framework/commands",
  "./app/commands",
];

const commandName = args[0];
const commandArgs = args.slice(1);

const cwd = process.cwd();

for (const dir of commandResolutionDirs) {
  try {
    const commands = await fs.readdir(path.join(cwd, dir)).then((c) =>
      c.map((f) => ({
        filePath: path.join(cwd, dir, f),
        commandName: f.replace(".ts", ""),
      }))
    );

    const command = commands.find((c) => c.commandName === commandName);
    if (command) {
      await runCommandInFileNamed(command.filePath);
      break;
    }
  } catch (e: any) {
    // Ignore a missing directory
    if (e.code !== "ENOENT") {
      console.error(e);
    }
  }
}

console.warn(`Command ${commandName} not found`);
