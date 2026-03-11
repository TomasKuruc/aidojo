import type { ParsedAccount, AccountStatus } from "../types";
import { isValidChecksum } from "./checksum";

/**
 * Determine the initial status of a parsed account (before repair).
 * - ILL: one or more digits are illegible ('?')
 * - ERR: all digits readable but checksum fails
 * - OK: all digits readable and checksum passes
 */
export function evaluateAccountStatus(account: ParsedAccount): AccountStatus {
  const hasIllegible = account.digits.some((d) => d.value === null);

  if (hasIllegible) return "ILL";

  const digitValues = account.digits.map((d) => d.value!);
  if (!isValidChecksum(digitValues)) return "ERR";

  return "OK";
}
