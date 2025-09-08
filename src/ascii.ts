import type { GridData } from "./parsers";

interface DrawAsciiOptions {
  grid: GridData;
  chars:
    | {
        filled: string;
        empty: string;
      }
    | undefined;
  inverse: boolean;
  scale: number | undefined;
}

export function drawAscii({
  grid,
  chars,
  inverse,
  scale = 1,
}: DrawAsciiOptions): string {
  let filled = chars?.filled ?? "█";
  let empty = chars?.empty ?? "░";

  if (inverse) {
    [filled, empty] = [empty, filled];
  }

  let ascii = grid.rows
    .map((row) =>
      row
        .split("")
        .map((char) => {
          return (
            {
              "1": filled,
              "0": empty,
            }[char] ?? char
          );
        })
        .join(""),
    )
    .join("\n");

  if (scale !== 1) {
    ascii = scaleAscii(ascii, scale);
  }

  return ascii;
}

function scaleAscii(ascii: string, scale: number): string {
  if (scale === 1) {
    return ascii;
  }

  const lines = ascii.split("\n");
  const scaledLines = [];

  for (const line of lines) {
    const scaledLine = line
      .split("")
      .map((char) => char.repeat(scale))
      .join("");

    for (let i = 0; i < scale; i++) {
      scaledLines.push(scaledLine);
    }
  }

  return scaledLines.join("\n");
}
