import type { ProcessedAccountResult } from "./types";
import { parseAccount, splitIntoEntries } from "./ocr/parser";
import {
  isValidChecksum,
  computeChecksumBreakdown,
} from "./account/checksum";
import { evaluateAccountStatus } from "./account/status";
import { repairAccount } from "./repair/repair";

/**
 * Process a single account entry (3 OCR lines) through the full pipeline:
 * parse → validate → repair → format.
 */
export function processAccountEntry(
  lines: readonly [string, string, string],
  originalOcr: string,
): ProcessedAccountResult {
  const account = parseAccount(lines);
  const initialStatus = evaluateAccountStatus(account);

  const digitValues = account.digits
    .map((d) => d.value)
    .filter((v): v is number => v !== null);
  const allDigitsReadable = digitValues.length === 9;
  const checksumValid = allDigitsReadable && isValidChecksum(digitValues);
  const checksumBreakdown = allDigitsReadable
    ? computeChecksumBreakdown(digitValues)
    : null;

  // Only attempt repair for ILL or ERR accounts
  if (initialStatus === "ILL" || initialStatus === "ERR") {
    const repair = repairAccount(account, initialStatus);

    return {
      originalOcr,
      accountString: account.accountString,
      status: repair.status,
      checksumValid: repair.repairedAccount !== null || checksumValid,
      checksumBreakdown,
      repairedAccount: repair.repairedAccount,
      alternatives: repair.alternatives,
      digits: account.digits,
      formattedOutput: formatOutput(
        repair.repairedAccount ?? account.accountString,
        repair.status,
        repair.alternatives,
      ),
    };
  }

  return {
    originalOcr,
    accountString: account.accountString,
    status: initialStatus,
    checksumValid,
    checksumBreakdown,
    repairedAccount: null,
    alternatives: [],
    digits: account.digits,
    formattedOutput: formatOutput(account.accountString, initialStatus, []),
  };
}

/**
 * Process raw OCR input text containing one or more account entries.
 */
export function processOcrInput(
  input: string,
): readonly ProcessedAccountResult[] {
  const entries = splitIntoEntries(input);
  return entries.map((lines) => {
    const originalOcr = lines.join("\n");
    return processAccountEntry(lines, originalOcr);
  });
}

/**
 * Format the output line in kata style:
 * "457508000"
 * "664371495 ERR"
 * "86110??36 ILL"
 * "888888888 AMB ['888886888', '888888880', '888888988']"
 */
function formatOutput(
  accountString: string,
  status: string,
  alternatives: readonly string[],
): string {
  if (status === "OK") return accountString;
  if (status === "AMB") {
    const altList = alternatives.map((a) => `'${a}'`).join(", ");
    return `${accountString} AMB [${altList}]`;
  }
  return `${accountString} ${status}`;
}
