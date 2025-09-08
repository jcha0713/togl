import { message } from "@optique/core";
import type { ValueParser, ValueParserResult } from "@optique/core/valueparser";

export interface Size {
  width: number;
  height: number;
}

export function sizeParser(): ValueParser<Size> {
  return {
    metavar: "WIDTHxHEIGHT",
    parse(input: string): ValueParserResult<Size> {
      const parts = input.split("x");
      if (parts.length !== 2) {
        return {
          success: false,
          error: message`Invalid size format: ${input}. Expected WIDTHxHEIGHT (e.g., 4x4)`,
        };
      }

      const width = parseInt(parts[0] ?? "0");
      const height = parseInt(parts[1] ?? "0");

      if (width <= 0 || height <= 0) {
        return {
          success: false,
          error: message`Invalid dimensions: ${input}. Width and height must be positive`,
        };
      }

      return {
        success: true,
        value: {
          width,
          height,
        },
      };
    },

    format(value) {
      return `${value.width}x${value.height}`;
    },
  };
}
