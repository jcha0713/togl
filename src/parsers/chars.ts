import { message } from "@optique/core";
import type { ValueParser, ValueParserResult } from "@optique/core/valueparser";

export function charsOptionParser(): ValueParser<{
  filled: string;
  empty: string;
}> {
  return {
    metavar: "CHARS",
    parse(input: string): ValueParserResult<{
      filled: string;
      empty: string;
    }> {
      if (input.length !== 2) {
        return {
          success: false,
          error: message`Expected exactly 2 characters (e.g., ".*"),
got ${String(input.length)} characters in: ${input}`,
        };
      }

      const filled = input.slice(0, 1);
      const empty = input.slice(1);

      if (filled === empty) {
        return {
          success: false,
          error: message`Characters must be different. Both characters are: ${filled}`,
        };
      }

      return {
        success: true,
        value: {
          filled,
          empty,
        },
      };
    },

    format(value) {
      return `${value.filled}:1 ${value.empty}:0`;
    },
  };
}
