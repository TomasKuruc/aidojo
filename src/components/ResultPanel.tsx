import type { ProcessedAccountResult } from "../domain/types";
import { StatusBadge } from "./StatusBadge";
import { DigitBreakdown } from "./DigitBreakdown";
import { ChecksumDetail } from "./ChecksumDetail";

function illegiblePositions(result: ProcessedAccountResult): number[] {
  return result.digits
    .map((d, i) => (d.value === null ? i + 1 : -1))
    .filter((i) => i !== -1);
}

function ReasonText({ result }: { result: ProcessedAccountResult }) {
  // OK — originally valid, no repair needed
  if (result.status === "OK" && !result.repairedAccount) {
    return (
      <span className="ok-reason">
        All 9 digits recognized, checksum is valid.
      </span>
    );
  }

  // OK — repaired from ERR or ILL
  if (result.status === "OK" && result.repairedAccount) {
    return (
      <span className="ok-reason">
        Original account <code>{result.accountString}</code> had{" "}
        {result.accountString.includes("?")
          ? "illegible digits"
          : "an invalid checksum"}
        . Repaired by changing one OCR segment
        {" — "}only <code>{result.repairedAccount}</code> produces a valid
        checksum.
      </span>
    );
  }

  // ERR — checksum failed, show breakdown
  if (result.status === "ERR" && result.checksumBreakdown) {
    return (
      <div>
        <div className="err-reason">
          All 9 digits recognized, but checksum is invalid. No single-segment
          correction produces a valid account.
        </div>
        <ChecksumDetail breakdown={result.checksumBreakdown} />
      </div>
    );
  }

  // ILL — illegible digits
  if (result.status === "ILL") {
    const positions = illegiblePositions(result);
    return (
      <span className="ill-reason">
        {positions.length === 1
          ? `Digit at position ${positions[0]} is illegible`
          : `Digits at positions ${positions.join(", ")} are illegible`}
        {" — "}checksum cannot be computed. No single-segment correction
        produces a valid account.
      </span>
    );
  }

  // AMB — multiple valid repairs
  if (result.status === "AMB") {
    return (
      <div>
        <span className="amb-reason">
          Original account <code>{result.accountString}</code> had{" "}
          {result.accountString.includes("?")
            ? "illegible digits"
            : "an invalid checksum"}
          . Multiple single-segment corrections produce a valid checksum
          {" — "}cannot determine the correct one.
        </span>
        {result.checksumBreakdown && !result.checksumBreakdown.valid && (
          <ChecksumDetail breakdown={result.checksumBreakdown} />
        )}
      </div>
    );
  }

  return null;
}

type ResultPanelProps = {
  results: readonly ProcessedAccountResult[];
};

export function ResultPanel({ results }: ResultPanelProps) {
  if (results.length === 0) {
    return (
      <div className="empty-state">
        Load an example or paste OCR input above, then click Process OCR.
      </div>
    );
  }

  return (
    <div className="results-section">
      <h2>Results ({results.length} account{results.length !== 1 ? "s" : ""})</h2>
      {results.map((result, index) => (
        <ResultCard key={index} result={result} />
      ))}
    </div>
  );
}

function ResultCard({ result }: { result: ProcessedAccountResult }) {
  return (
    <div className="result-card">
      <div className="account-number-row">
        <span className="account-number">
          {result.repairedAccount ?? result.accountString}
        </span>
        <StatusBadge status={result.status} />
      </div>

      <div className="result-details">
        {result.repairedAccount && (
          <div className="result-detail">
            <span className="result-detail-label">Original:</span>
            <span className="result-detail-value">
              {result.accountString}
            </span>
          </div>
        )}

        {result.repairedAccount && (
          <div className="result-detail">
            <span className="result-detail-label">Repaired to:</span>
            <span className="result-detail-value repaired-account">
              {result.repairedAccount}
            </span>
          </div>
        )}

        <div className="result-detail">
          <span className="result-detail-label">Checksum:</span>
          <span className="result-detail-value">
            {result.checksumValid ? "Pass" : "Fail"}
          </span>
        </div>

        <div className="result-detail">
          <span className="result-detail-label">Reason:</span>
          <div className="result-detail-value">
            <ReasonText result={result} />
          </div>
        </div>

        {result.alternatives.length > 0 && (
          <div className="result-detail">
            <span className="result-detail-label">Alternatives:</span>
            <div className="alternatives-list">
              {result.alternatives.map((alt) => (
                <span key={alt} className="alternative-tag">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="result-detail">
          <span className="result-detail-label">Kata output:</span>
          <span className="result-detail-value">
            {result.formattedOutput}
          </span>
        </div>
      </div>

      <div className="ocr-preview">{result.originalOcr}</div>

      <DigitBreakdown digits={result.digits} />
    </div>
  );
}
