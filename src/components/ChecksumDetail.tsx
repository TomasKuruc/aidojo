import type { ChecksumBreakdown } from "../domain/types";

type ChecksumDetailProps = {
  breakdown: ChecksumBreakdown;
};

export function ChecksumDetail({ breakdown }: ChecksumDetailProps) {
  const formula = breakdown.terms
    .map((t) => `${t.weight}×${t.digit}`)
    .join(" + ");

  return (
    <div className="checksum-detail">
      <div className="checksum-formula">
        {formula} = {breakdown.sum}
      </div>
      <div className="checksum-result">
        {breakdown.sum} mod 11 = {breakdown.remainder}
        {breakdown.valid ? "" : " ≠ 0"}
      </div>
    </div>
  );
}
