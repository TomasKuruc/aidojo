import type { ParsedDigit } from "../domain/types";

type DigitBreakdownProps = {
  digits: readonly ParsedDigit[];
};

export function DigitBreakdown({ digits }: DigitBreakdownProps) {
  return (
    <div className="digit-breakdown">
      <div className="digit-breakdown-title">Digit breakdown</div>
      <div className="digit-grid">
        {digits.map((digit, index) => (
          <div key={index} className="digit-cell">
            <div className="digit-cell-pattern">
              {digit.pattern[0]}
              {"\n"}
              {digit.pattern[1]}
              {"\n"}
              {digit.pattern[2]}
            </div>
            <div
              className={`digit-cell-value ${digit.value === null ? "digit-cell-value--illegible" : ""}`}
            >
              {digit.value !== null ? digit.value : "?"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
