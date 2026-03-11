import type { OcrDigitPattern, ParsedDigit, ParsedAccount } from "../types";
import { recognizeDigit } from "./digits";

const DIGITS_PER_ACCOUNT = 9;
const CHARS_PER_DIGIT = 3;
const LINES_PER_ENTRY = 3;

/**
 * Extract the 3×3 OCR pattern for one digit at the given position (0–8)
 * from three OCR lines.
 */
export function extractDigitPattern(
  lines: readonly [string, string, string],
  position: number,
): OcrDigitPattern {
  const startCol = position * CHARS_PER_DIGIT;
  return [
    padAndSlice(lines[0], startCol),
    padAndSlice(lines[1], startCol),
    padAndSlice(lines[2], startCol),
  ];
}

/** Safely extract 3 characters from a line, padding with spaces if needed. */
function padAndSlice(line: string, start: number): string {
  const padded = line.padEnd(start + CHARS_PER_DIGIT, " ");
  return padded.slice(start, start + CHARS_PER_DIGIT);
}

/** Parse a single OCR digit pattern into a ParsedDigit. */
export function parseDigit(pattern: OcrDigitPattern): ParsedDigit {
  return {
    value: recognizeDigit(pattern),
    pattern,
  };
}

/**
 * Parse a full account entry from 3 OCR lines.
 * Returns the 9 parsed digits and the account string.
 */
export function parseAccount(
  lines: readonly [string, string, string],
): ParsedAccount {
  const digits: ParsedDigit[] = [];

  for (let i = 0; i < DIGITS_PER_ACCOUNT; i++) {
    const pattern = extractDigitPattern(lines, i);
    digits.push(parseDigit(pattern));
  }

  const accountString = digits
    .map((d) => (d.value !== null ? d.value.toString() : "?"))
    .join("");

  return { digits, accountString };
}

/**
 * Split raw OCR input text into groups of 3 OCR lines (ignoring blank separators).
 * Each group represents one account entry.
 */
export function splitIntoEntries(
  input: string,
): readonly (readonly [string, string, string])[] {
  const allLines = input.split("\n");
  const entries: [string, string, string][] = [];
  const contentLines: string[] = [];

  for (const line of allLines) {
    // Blank lines act as separators between entries
    if (line.trim() === "" && contentLines.length >= LINES_PER_ENTRY) {
      continue;
    }

    contentLines.push(line);

    if (contentLines.length === LINES_PER_ENTRY) {
      entries.push([contentLines[0]!, contentLines[1]!, contentLines[2]!]);
      contentLines.length = 0;
    }
  }

  // Handle trailing entry without final blank line
  if (contentLines.length === LINES_PER_ENTRY) {
    entries.push([contentLines[0]!, contentLines[1]!, contentLines[2]!]);
  }

  return entries;
}
