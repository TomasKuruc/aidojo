import { describe, it, expect } from "vitest";
import {
  parseAccount,
  extractDigitPattern,
  splitIntoEntries,
} from "../domain/ocr/parser";

describe("extractDigitPattern", () => {
  it("extracts the first digit from OCR lines", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "| || || || || || || || || |",
      "|_||_||_||_||_||_||_||_||_|",
    ];
    expect(extractDigitPattern(lines, 0)).toEqual([" _ ", "| |", "|_|"]);
  });

  it("extracts the second digit from OCR lines", () => {
    const lines: [string, string, string] = [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
    ];
    expect(extractDigitPattern(lines, 1)).toEqual([" _ ", " _|", "|_ "]);
  });
});

describe("parseAccount", () => {
  it("parses all zeros", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "| || || || || || || || || |",
      "|_||_||_||_||_||_||_||_||_|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("000000000");
  });

  it("parses all ones", () => {
    const lines: [string, string, string] = [
      "                           ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("111111111");
  });

  it("parses 123456789", () => {
    const lines: [string, string, string] = [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("123456789");
  });

  it("parses all twos", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("222222222");
  });

  it("parses all threes", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      " _| _| _| _| _| _| _| _| _|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("333333333");
  });

  it("parses all fours", () => {
    const lines: [string, string, string] = [
      "                           ",
      "|_||_||_||_||_||_||_||_||_|",
      "  |  |  |  |  |  |  |  |  |",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("444444444");
  });

  it("parses all fives", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
      " _| _| _| _| _| _| _| _| _|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("555555555");
  });

  it("parses all sixes", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
      "|_||_||_||_||_||_||_||_||_|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("666666666");
  });

  it("parses all sevens", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("777777777");
  });

  it("parses all eights", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      "|_||_||_||_||_||_||_||_||_|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("888888888");
  });

  it("parses all nines", () => {
    const lines: [string, string, string] = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      " _| _| _| _| _| _| _| _| _|",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("999999999");
  });

  it("marks illegible digits with ?", () => {
    const lines: [string, string, string] = [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_| _ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _ ",
    ];
    const result = parseAccount(lines);
    expect(result.accountString).toBe("1234?678?");
  });
});

describe("splitIntoEntries", () => {
  it("splits input with blank separator lines", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "| || || || || || || || || |",
      "|_||_||_||_||_||_||_||_||_|",
      "",
      "                           ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ].join("\n");

    const entries = splitIntoEntries(input);
    expect(entries).toHaveLength(2);
  });

  it("handles input without trailing blank line", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "| || || || || || || || || |",
      "|_||_||_||_||_||_||_||_||_|",
    ].join("\n");

    const entries = splitIntoEntries(input);
    expect(entries).toHaveLength(1);
  });
});
