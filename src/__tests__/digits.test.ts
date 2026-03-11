import { describe, it, expect } from "vitest";
import {
  recognizeDigit,
  findAlternativeDigits,
  digitPattern,
} from "../domain/ocr/digits";
import type { OcrDigitPattern } from "../domain/types";

describe("recognizeDigit", () => {
  const cases: [OcrDigitPattern, number][] = [
    [[" _ ", "| |", "|_|"], 0],
    [["   ", "  |", "  |"], 1],
    [[" _ ", " _|", "|_ "], 2],
    [[" _ ", " _|", " _|"], 3],
    [["   ", "|_|", "  |"], 4],
    [[" _ ", "|_ ", " _|"], 5],
    [[" _ ", "|_ ", "|_|"], 6],
    [[" _ ", "  |", "  |"], 7],
    [[" _ ", "|_|", "|_|"], 8],
    [[" _ ", "|_|", " _|"], 9],
  ];

  it.each(cases)("recognizes digit %# → %i", (pattern, expected) => {
    expect(recognizeDigit(pattern)).toBe(expected);
  });

  it("returns null for an unknown pattern", () => {
    const unknown: OcrDigitPattern = [" _ ", " _ ", " _ "];
    expect(recognizeDigit(unknown)).toBeNull();
  });
});

describe("findAlternativeDigits", () => {
  it("finds alternatives for digit 0 (can become 8)", () => {
    const alts = findAlternativeDigits(digitPattern(0));
    expect(alts).toContain(8);
  });

  it("finds alternatives for digit 1 (can become 7)", () => {
    const alts = findAlternativeDigits(digitPattern(1));
    expect(alts).toContain(7);
  });

  it("finds alternatives for digit 5 (can become 6 and 9)", () => {
    const alts = findAlternativeDigits(digitPattern(5));
    expect(alts).toContain(6);
    expect(alts).toContain(9);
  });

  it("finds alternatives for digit 8 (can become 0, 6, 9)", () => {
    const alts = findAlternativeDigits(digitPattern(8));
    expect(alts).toContain(0);
    expect(alts).toContain(6);
    expect(alts).toContain(9);
  });

  it("finds alternatives for digit 9 (can become 8 and 5)", () => {
    const alts = findAlternativeDigits(digitPattern(9));
    expect(alts).toContain(8);
    expect(alts).toContain(5);
  });
});
