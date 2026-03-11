/** Predefined OCR input examples for the UI example loader. */
export type OcrExample = {
  readonly label: string;
  readonly description: string;
  readonly input: string;
};

export const OCR_EXAMPLES: readonly OcrExample[] = [
  {
    label: "Valid: 123456789",
    description: "A valid account with correct checksum",
    input: [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
    ].join("\n"),
  },
  {
    label: "Valid: 000000051",
    description: "A valid account with zeros",
    input: [
      " _  _  _  _  _  _  _  _    ",
      "| || || || || || || ||_   |",
      "|_||_||_||_||_||_||_| _|  |",
    ].join("\n"),
  },
  {
    label: "Illegible: 1234?678?",
    description: "Account with two illegible digits (ILL)",
    input: [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_| _ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _ ",
    ].join("\n"),
  },
  {
    label: "Illegible: 49006771?",
    description: "Account with one illegible digit (ILL)",
    input: [
      "    _  _  _  _  _  _     _ ",
      "|_||_|| || ||_   |  |  | _ ",
      "  | _||_||_||_|  |  |  | _|",
    ].join("\n"),
  },
  {
    label: "ERR: 222222222",
    description: "All digits readable but checksum fails, no repair possible (ERR)",
    input: [
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
    ].join("\n"),
  },
  {
    label: "Repair: 111111111 → 711111111",
    description: "ERR account repairable to exactly one valid alternative",
    input: [
      "                           ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ].join("\n"),
  },
  {
    label: "Repair: 333333333 → 333393333",
    description: "ERR account repairable to exactly one valid alternative",
    input: [
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      " _| _| _| _| _| _| _| _| _|",
    ].join("\n"),
  },
  {
    label: "Ambiguous: 888888888",
    description: "ERR with 3 valid alternatives (AMB)",
    input: [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      "|_||_||_||_||_||_||_||_||_|",
    ].join("\n"),
  },
  {
    label: "Ambiguous: 999999999",
    description: "ERR with 3 valid alternatives (AMB)",
    input: [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      " _| _| _| _| _| _| _| _| _|",
    ].join("\n"),
  },
  {
    label: "Ambiguous: 490067715",
    description: "ERR with 3 valid alternatives (AMB)",
    input: [
      "    _  _  _  _  _  _     _ ",
      "|_||_|| || ||_   |  |  ||_ ",
      "  | _||_||_||_|  |  |  | _|",
    ].join("\n"),
  },
  {
    label: "Multiple accounts",
    description: "Three accounts: valid, ILL, and ERR",
    input: [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
      "",
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_| _ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _ ",
      "",
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      "|_||_||_||_||_||_||_||_||_|",
    ].join("\n"),
  },
];
