import { describe, it, expect } from "vitest";
import { processOcrInput } from "../domain/process";

describe("processOcrInput — full pipeline", () => {
  it("parses and validates a valid account (000000051)", () => {
    const input = [
      " _  _  _  _  _  _  _  _    ",
      "| || || || || || || ||_   |",
      "|_||_||_||_||_||_||_| _|  |",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.accountString).toBe("000000051");
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.formattedOutput).toBe("000000051");
  });

  it("detects and reports ILL status", () => {
    const input = [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_| _ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _ ",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.accountString).toBe("1234?678?");
    expect(results[0]!.status).toBe("ILL");
  });

  // User Story 4: repair tests
  it("repairs 111111111 to 711111111", () => {
    const input = [
      "                           ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.repairedAccount).toBe("711111111");
  });

  it("repairs 777777777 to 777777177", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "  |  |  |  |  |  |  |  |  |",
      "  |  |  |  |  |  |  |  |  |",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.repairedAccount).toBe("777777177");
  });

  it("repairs 200000000 to 200800000", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      " _|| || || || || || || || |",
      "|_ |_||_||_||_||_||_||_||_|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.repairedAccount).toBe("200800000");
  });

  it("repairs 333333333 to 333393333", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      " _| _| _| _| _| _| _| _| _|",
      " _| _| _| _| _| _| _| _| _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.repairedAccount).toBe("333393333");
  });

  it("detects AMB for 888888888", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      "|_||_||_||_||_||_||_||_||_|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("AMB");
    expect(results[0]!.alternatives).toEqual([
      "888886888",
      "888888880",
      "888888988",
    ]);
  });

  it("detects AMB for 555555555", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
      " _| _| _| _| _| _| _| _| _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("AMB");
    expect(results[0]!.alternatives).toEqual(["555655555", "559555555"]);
  });

  it("detects AMB for 666666666", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_ |_ |_ |_ |_ |_ |_ |_ |_ ",
      "|_||_||_||_||_||_||_||_||_|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("AMB");
    expect(results[0]!.alternatives).toEqual(["666566666", "686666666"]);
  });

  it("detects AMB for 999999999", () => {
    const input = [
      " _  _  _  _  _  _  _  _  _ ",
      "|_||_||_||_||_||_||_||_||_|",
      " _| _| _| _| _| _| _| _| _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("AMB");
    expect(results[0]!.alternatives).toEqual([
      "899999999",
      "993999999",
      "999959999",
    ]);
  });

  it("detects AMB for 490067715", () => {
    const input = [
      "    _  _  _  _  _  _     _ ",
      "|_||_|| || ||_   |  |  ||_ ",
      "  | _||_||_||_|  |  |  | _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("AMB");
    expect(results[0]!.alternatives).toEqual([
      "490067115",
      "490067719",
      "490867715",
    ]);
  });

  it("parses valid 123456789 (no repair needed)", () => {
    const input = [
      "    _  _     _  _  _  _  _ ",
      "  | _| _||_||_ |_   ||_||_|",
      "  ||_  _|  | _||_|  ||_| _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.accountString).toBe("123456789");
    expect(results[0]!.status).toBe("OK");
  });

  it("repairs 490067715 from ILL input", () => {
    const input = [
      "    _  _  _  _  _  _     _ ",
      "|_||_|| ||_||_   |  |  | _ ",
      "  | _||_||_||_|  |  |  | _|",
    ].join("\n");

    const results = processOcrInput(input);
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe("OK");
    expect(results[0]!.repairedAccount).toBe("490867715");
  });
});
