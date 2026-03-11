import type { ParsedAccount, AccountStatus } from "../types";
import { findAlternativeDigits } from "../ocr/digits";
import { isValidChecksum } from "../account/checksum";

export type RepairResult = {
  /** Final status after repair attempt. */
  readonly status: AccountStatus;
  /** The corrected account string, if exactly one valid correction exists. */
  readonly repairedAccount: string | null;
  /** All valid alternative account strings (for AMB display). */
  readonly alternatives: readonly string[];
};

/**
 * Attempt to repair an ILL or ERR account by toggling exactly one
 * OCR segment in one digit position. Collects all valid alternatives.
 *
 * - If exactly one valid alternative: return it as the correction.
 * - If multiple: status is AMB with all alternatives listed.
 * - If none: preserve original status (ILL or ERR).
 */
export function repairAccount(
  account: ParsedAccount,
  originalStatus: AccountStatus,
): RepairResult {
  const validAlternatives: string[] = [];
  const originalDigitValues = account.digits.map((d) => d.value);

  // Try changing each digit position one at a time
  for (let pos = 0; pos < 9; pos++) {
    const digit = account.digits[pos]!;
    const alternativeDigits = findAlternativeDigits(digit.pattern);

    for (const altDigit of alternativeDigits) {
      // Build the candidate account with this one digit replaced
      const candidateValues = [...originalDigitValues];
      candidateValues[pos] = altDigit;

      // All digits must be readable for a valid checksum
      if (candidateValues.some((v) => v === null)) continue;

      const allDigits = candidateValues as number[];
      if (isValidChecksum(allDigits)) {
        const accountStr = allDigits.join("");
        if (!validAlternatives.includes(accountStr)) {
          validAlternatives.push(accountStr);
        }
      }
    }
  }

  if (validAlternatives.length === 1) {
    return {
      status: "OK",
      repairedAccount: validAlternatives[0]!,
      alternatives: [],
    };
  }

  if (validAlternatives.length > 1) {
    return {
      status: "AMB",
      repairedAccount: null,
      alternatives: validAlternatives.sort(),
    };
  }

  // No valid correction found — preserve original status
  return {
    status: originalStatus,
    repairedAccount: null,
    alternatives: [],
  };
}
