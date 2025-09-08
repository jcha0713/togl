#!/usr/bin/env bun

import { message } from "@optique/core/message";
import {
  argument,
  command,
  constant,
  merge,
  object,
  option,
  optional,
  or,
} from "@optique/core/parser";
import { print, printError, run } from "@optique/run";
import { drawAscii } from "./ascii";
import { charsOption, inverseFlag, scaleOption } from "./options";
import type { GridData, Size } from "./parsers";
import { drawInputParser, sizeParser, wrapInputParser } from "./parsers";

const globalOptions = object({
  inverseFlag,
  charsOption,
  scaleOption,
});

const draw = command(
  "draw",
  merge(
    globalOptions,
    object({
      action: constant("draw"),
      input: optional(argument(drawInputParser())),
    }),
  ),
);

const wrap = command(
  "wrap",
  merge(
    globalOptions,
    object({
      action: constant("wrap"),
      size: option("-s", "--size", sizeParser()),
      whitespace: option("-p", "--preserve-whitespace"),
      input: argument(wrapInputParser()),
    }),
  ),
);

const parser = or(draw, wrap);

function wrapInput(
  input: string,
  size: Size,
  preserveWhitespace: boolean,
): GridData {
  const { width, height } = size;
  const totalCells = width * height;
  const rows = [];

  if (!preserveWhitespace) {
    input = input.trim().replaceAll(/\s+/g, "");
  }

  for (let i = 0; i < totalCells && i < input.length; i += width) {
    rows.push(input.slice(i, i + width));
  }

  return {
    rows,
    width,
    height: rows.length,
  };
}

async function readStdin(): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(chunk);
  }
  return new TextDecoder().decode(Buffer.concat(chunks)).trim();
}

async function main() {
  try {
    const result = run(parser, {
      programName: "togl",
      brief: message`Convert binary patterns to ASCII art`,
      description: message`A command line tool to convert binary grid patterns into ASCII art drawings`,
      help: "option",
      colors: true,
    });

    let grid: GridData;

    if (result.action === "draw") {
      if (result.input) {
        grid = result.input;
      } else {
        const stdinInput = await readStdin();
        if (!stdinInput) {
          printError(
            message`No input provided. Use argument or pipe input to togl draw`,
            { exitCode: 1 },
          );
        }
        const parser = drawInputParser();
        const parseResult = parser.parse(stdinInput);
        if (!parseResult.success) {
          printError(parseResult.error, { exitCode: 1 });
        }
        grid = parseResult.value;
      }
    } else {
      grid = wrapInput(
        result.input.parsedInput,
        result.size,
        result.whitespace,
      );
    }

    const ascii = drawAscii({
      grid,
      chars: result.charsOption,
      inverse: result.inverseFlag,
      scale: result.scaleOption,
    });

    print(message`${ascii}`, {
      quotes: false,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    printError(message`${errorMessage}`, { exitCode: 1 });
  }
}

main();
