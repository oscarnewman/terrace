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

const commandResolutionDirs = [
  "node_modules/framework/commands",
  "./app/commands",
];

// commands are stored as files in each of those dirs. "Framework" responds to the framework npm package and its sub-dir.
// We need to resolve the command name to a file path.

const commandName = args[0];
const commandArgs = args.slice(1);

const cwd = process.cwd();

for (const dir of commandResolutionDirs) {
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
}

console.warn(`Command ${commandName} not found`);
