import { describe, it, expect } from "vitest";
import { evaluateAccountStatus } from "../domain/account/status";
import { parseAccount } from "../domain/ocr/parser";

describe("evaluateAccountStatus", () => {
  it("returns OK for valid account 000000000", () => {
    const account = parseAccount([
      " _  _  _  _  _  _  _  _  _ ",
      "| || || || || || || || || |",
      "|_||_||_||_||_||_||_||_||_|",
    ]);
    expect(evaluateAccountStatus(account)).toBe("OK");
  });

  it("returns OK for valid account 123456789", () => {
    const account = parseAccount([
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
    ]);
    expect(evaluateAccountStatus(account)).toBe("OK");
  });

  it("returns ERR for invalid checksum 222222222", () => {
    const account = parseAccount([
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
    ]);
    expect(evaluateAccountStatus(account)).toBe("ERR");
  });

  it("returns ILL for illegible account", () => {
    const account = parseAccount([
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_| _ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _ ",
    ]);
    expect(evaluateAccountStatus(account)).toBe("ILL");
  });
});
