import { test, expect, describe } from "bun:test";
import { drawInputParser, wrapInputParser } from "./input";

describe("drawInputParser", () => {
  const parser = drawInputParser();

  test("should parse valid whitespace-separated rows", () => {
    const result = parser.parse("01 10");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.rows).toEqual(["01", "10"]);
      expect(result.value.width).toBe(2);
      expect(result.value.height).toBe(2);
    }
  });

  test("should parse single character input", () => {
    const result = parser.parse("11 11");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.rows).toEqual(["11", "11"]);
      expect(result.value.width).toBe(2);
      expect(result.value.height).toBe(2);
    }
  });

  test("should fail on empty input", () => {
    const result = parser.parse("");
    expect(result.success).toBe(false);
  });

  test("should fail on whitespace-only input", () => {
    const result = parser.parse("   ");
    expect(result.success).toBe(false);
  });

  test("should fail on inconsistent row lengths", () => {
    const result = parser.parse("01 1");
    expect(result.success).toBe(false);
  });

  test("should fail on more than 2 unique characters", () => {
    const result = parser.parse("abc def");
    expect(result.success).toBe(false);
  });

  test("should parse newline-separated input", () => {
    const result = parser.parse("01\n10\n11");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.rows).toEqual(["01", "10", "11"]);
      expect(result.value.width).toBe(2);
      expect(result.value.height).toBe(3);
    }
  });

  test("should handle multiple consecutive spaces", () => {
    const result = parser.parse("01   10    11");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.rows).toEqual(["01", "10", "11"]);
      expect(result.value.width).toBe(2);
      expect(result.value.height).toBe(3);
    }
  });

  test("should handle mixed whitespace and newlines", () => {
    const result = parser.parse("01  10\n11   00");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.rows).toEqual(["01", "10", "11", "00"]);
      expect(result.value.width).toBe(2);
      expect(result.value.height).toBe(4);
    }
  });

  test("should format input back to string", () => {
    const gridData = {
      rows: ["01", "10"],
      width: 2,
      height: 2,
    };
    const formatted = parser.format(gridData);
    expect(formatted).toBe("01 10");
  });
});

describe("wrapInputParser", () => {
  const parser = wrapInputParser();

  test("should parse valid continuous input", () => {
    const result = parser.parse("0110");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.parsedInput).toBe("0110");
    }
  });

  test("should parse single character input", () => {
    const result = parser.parse("1111");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.parsedInput).toBe("1111");
    }
  });

  test("should fail on empty input", () => {
    const result = parser.parse("");
    expect(result.success).toBe(false);
  });

  test("should fail on input with commas", () => {
    const result = parser.parse("01,10");
    expect(result.success).toBe(false);
  });

  test("should fail on more than 2 unique characters", () => {
    const result = parser.parse("abc123");
    expect(result.success).toBe(false);
  });

  test("should format input back to string", () => {
    const formatted = parser.format({ parsedInput: "0110" });
    expect(formatted).toBe("0110");
  });
});
