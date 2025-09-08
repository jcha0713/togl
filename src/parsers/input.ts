import { message } from "@optique/core";
import type { ValueParser, ValueParserResult } from "@optique/core/valueparser";

export interface GridData {
  rows: string[];
  width: number;
  height: number;
}

export function drawInputParser(): ValueParser<GridData> {
  return {
    metavar: "ROWS",
    parse(input: string): ValueParserResult<GridData> {
      if (input.trim().length <= 0) {
        return {
          success: false,
          error: message`Input is empty`,
        };
      }

      const normalizedInput = input.replaceAll(/\s+/g, "");

      const uniqueChars = new Set(normalizedInput);
      if (uniqueChars.size > 2) {
        return {
          success: false,
          error: message`Input can contain at most 2 unique characters,
found ${String(uniqueChars.size)}: ${Array.from(uniqueChars).join(", ")} in: ${input}`,
        };
      }

      const rows = input
        .replaceAll(/\s+/g, " ")
        .split(" ")
        .filter((chunk) => chunk.length > 0);
      const firstRow = rows[0];

      if (!firstRow || firstRow.length === 0) {
        return {
          success: false,
          error: message`Expected whitespace separated rows,
but first row is empty in: ${input}`,
        };
      }

      const width = firstRow.length;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] ?? "";

        if (row.length !== width) {
          return {
            success: false,
            error: message`All rows must have the same length. First row has ${String(width)} characters,
but row ${String(i + 1)} has ${String(row.length)} characters in: ${input}`,
          };
        }
      }

      return {
        success: true,
        value: {
          rows,
          width,
          height: rows.length,
        },
      };
    },
    format(value) {
      return value.rows.join(" ");
    },
  };
}

export function wrapInputParser(): ValueParser<{
  parsedInput: string;
}> {
  return {
    metavar: "CONTINUOUS_INPUT",
    parse(input: string): ValueParserResult<{ parsedInput: string }> {
      if (input.length <= 0) {
        return {
          success: false,
          error: message`Expected continuous binary input, but input is empty`,
        };
      }

      const normalizedInput = input.replaceAll(/\s+/g, "");
      const uniqueChars = new Set(normalizedInput);
      if (uniqueChars.size > 2) {
        return {
          success: false,
          error: message`Input can contain at most 2 unique characters,
found ${String(uniqueChars.size)}: ${Array.from(uniqueChars).join(", ")} in: ${input}`,
        };
      }

      return {
        success: true,
        value: {
          parsedInput: input,
        },
      };
    },
    format(value) {
      return value.parsedInput;
    },
  };
}
