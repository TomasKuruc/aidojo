import type { ChecksumBreakdown } from "../types";

/**
 * Validate an account number using the Bank OCR checksum rule.
 *
 * account number:  d9 d8 d7 d6 d5 d4 d3 d2 d1
 * checksum: (d1 + 2*d2 + 3*d3 + ... + 9*d9) mod 11 = 0
 *
 * The rightmost digit (index 8) has weight 1, leftmost (index 0) has weight 9.
 */
export function isValidChecksum(digits: readonly number[]): boolean {
  if (digits.length !== 9) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const weight = 9 - i; // d9 gets weight 9, d1 gets weight 1
    sum += weight * digits[i]!;
  }

  return sum % 11 === 0;
}

/** Compute a detailed breakdown of the checksum calculation. */
export function computeChecksumBreakdown(
  digits: readonly number[],
): ChecksumBreakdown {
  const terms = digits.map((digit, i) => {
    const weight = 9 - i;
    return { digit, weight, product: weight * digit };
  });
  const sum = terms.reduce((acc, t) => acc + t.product, 0);
  const remainder = sum % 11;
  return { terms, sum, remainder, valid: remainder === 0 };
}
