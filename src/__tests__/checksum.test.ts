import { describe, it, expect } from "vitest";
import { isValidChecksum } from "../domain/account/checksum";

describe("isValidChecksum", () => {
  it("validates 345882865 (the kata example)", () => {
    // (9*3 + 8*4 + 7*5 + 6*8 + 5*8 + 4*2 + 3*8 + 2*6 + 1*5)
    // = 27 + 32 + 35 + 48 + 40 + 8 + 24 + 12 + 5 = 231
    // 231 % 11 = 0 ✓
    expect(isValidChecksum([3, 4, 5, 8, 8, 2, 8, 6, 5])).toBe(true);
  });

  it("validates 000000000", () => {
    expect(isValidChecksum([0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(true);
  });

  it("validates 000000051", () => {
    // (9*0 + ... + 2*5 + 1*1) = 11, 11 % 11 = 0
    expect(isValidChecksum([0, 0, 0, 0, 0, 0, 0, 5, 1])).toBe(true);
  });

  it("validates 123456789", () => {
    expect(isValidChecksum([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(true);
  });

  it("validates 457508000", () => {
    expect(isValidChecksum([4, 5, 7, 5, 0, 8, 0, 0, 0])).toBe(true);
  });

  it("rejects 664371495", () => {
    expect(isValidChecksum([6, 6, 4, 3, 7, 1, 4, 9, 5])).toBe(false);
  });

  it("rejects arrays with wrong length", () => {
    expect(isValidChecksum([1, 2, 3])).toBe(false);
  });

  it("validates 711111111 (repair test case)", () => {
    expect(isValidChecksum([7, 1, 1, 1, 1, 1, 1, 1, 1])).toBe(true);
  });
});
