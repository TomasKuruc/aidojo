/** A 3-line representation of a single OCR digit (each line is 3 characters). */
export type OcrDigitPattern = readonly [string, string, string];

/** Result of parsing one OCR digit. */
export type ParsedDigit = {
  /** The recognized digit value, or null if illegible. */
  readonly value: number | null;
  /** The raw 3×3 OCR pattern that was extracted. */
  readonly pattern: OcrDigitPattern;
};

/** Result of parsing a full 9-digit account from OCR input. */
export type ParsedAccount = {
  /** The 9 parsed digits. */
  readonly digits: readonly ParsedDigit[];
  /** The account string with '?' for illegible digits. */
  readonly accountString: string;
};

export type AccountStatus = "OK" | "ERR" | "ILL" | "AMB";

/** Step-by-step breakdown of the checksum calculation. */
export type ChecksumBreakdown = {
  /** Individual terms: { digit, weight, product } for each position. */
  readonly terms: readonly {
    readonly digit: number;
    readonly weight: number;
    readonly product: number;
  }[];
  /** The weighted sum before modulo. */
  readonly sum: number;
  /** sum mod 11. Must be 0 for a valid checksum. */
  readonly remainder: number;
  /** Whether the checksum passes. */
  readonly valid: boolean;
};

/** The fully processed result for one account entry. */
export type ProcessedAccountResult = {
  /** The raw OCR text for this entry. */
  readonly originalOcr: string;
  /** The parsed account string (with '?' for illegible digits). */
  readonly accountString: string;
  /** Final status after parsing, validation, and repair. */
  readonly status: AccountStatus;
  /** Whether the parsed account passes the checksum (false if illegible). */
  readonly checksumValid: boolean;
  /** Detailed checksum calculation breakdown (null if digits are illegible). */
  readonly checksumBreakdown: ChecksumBreakdown | null;
  /** If repair found exactly one valid correction, the corrected account string. */
  readonly repairedAccount: string | null;
  /** If status is AMB, the list of valid alternative account strings. */
  readonly alternatives: readonly string[];
  /** The 9 parsed digits for detailed display. */
  readonly digits: readonly ParsedDigit[];
  /** The kata-style formatted output line. */
  readonly formattedOutput: string;
};
