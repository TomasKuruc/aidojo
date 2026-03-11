import type { OcrDigitPattern } from "../types";

/**
 * Canonical OCR patterns for digits 0–9.
 * Each pattern is 3 lines of exactly 3 characters.
 */
const DIGIT_PATTERNS: readonly OcrDigitPattern[] = [
  [" _ ", "| |", "|_|"], // 0
  ["   ", "  |", "  |"], // 1
  [" _ ", " _|", "|_ "], // 2
  [" _ ", " _|", " _|"], // 3
  ["   ", "|_|", "  |"], // 4
  [" _ ", "|_ ", " _|"], // 5
  [" _ ", "|_ ", "|_|"], // 6
  [" _ ", "  |", "  |"], // 7
  [" _ ", "|_|", "|_|"], // 8
  [" _ ", "|_|", " _|"], // 9
];

/** Map from pattern string key to digit value for O(1) lookup. */
const patternToDigit = new Map<string, number>();
for (let digit = 0; digit < DIGIT_PATTERNS.length; digit++) {
  const pattern = DIGIT_PATTERNS[digit]!;
  patternToDigit.set(patternKey(pattern), digit);
}

/** Create a stable string key from a digit pattern. */
export function patternKey(pattern: OcrDigitPattern): string {
  return pattern.join("\n");
}

/** Look up the digit value for an OCR pattern, or null if unrecognized. */
export function recognizeDigit(pattern: OcrDigitPattern): number | null {
  return patternToDigit.get(patternKey(pattern)) ?? null;
}

/** Get the canonical OCR pattern for a given digit (0–9). */
export function digitPattern(digit: number): OcrDigitPattern {
  const pattern = DIGIT_PATTERNS[digit];
  if (!pattern) throw new Error(`Invalid digit: ${digit}`);
  return pattern;
}

/**
 * Segment positions in the 3×3 grid that can be toggled.
 * Each entry: [row, col, character-when-on].
 */
export const SEGMENT_POSITIONS: readonly (readonly [number, number, string])[] =
  [
    [0, 1, "_"], // top bar
    [1, 0, "|"], // upper-left
    [1, 1, "_"], // middle bar
    [1, 2, "|"], // upper-right
    [2, 0, "|"], // lower-left
    [2, 1, "_"], // bottom bar
    [2, 2, "|"], // lower-right
  ];

/**
 * Generate all OCR digit patterns reachable by toggling exactly one segment.
 * Toggling means: if the segment is on, turn it off (space); if off, turn it on.
 */
export function generateAlternativePatterns(
  pattern: OcrDigitPattern,
): OcrDigitPattern[] {
  const alternatives: OcrDigitPattern[] = [];

  for (const [row, col, onChar] of SEGMENT_POSITIONS) {
    const lines = [pattern[0]!, pattern[1]!, pattern[2]!];
    const currentChar = lines[row]![col];

    // Toggle: if it's the on-character, set to space; if space, set to on-character
    const newChar = currentChar === onChar ? " " : onChar;

    const chars = lines[row]!.split("");
    chars[col] = newChar;
    const newLines = [...lines] as [string, string, string];
    newLines[row] = chars.join("");

    alternatives.push(newLines);
  }

  return alternatives;
}

/**
 * For a given OCR digit pattern, find all digit values reachable
 * by toggling exactly one segment.
 */
export function findAlternativeDigits(
  pattern: OcrDigitPattern,
): readonly number[] {
  const alternatives = generateAlternativePatterns(pattern);
  const results: number[] = [];

  for (const alt of alternatives) {
    const digit = recognizeDigit(alt);
    if (digit !== null) {
      results.push(digit);
    }
  }

  return results;
}
