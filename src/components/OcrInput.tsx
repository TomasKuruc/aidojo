type OcrInputProps = {
  value: string;
  onChange: (value: string) => void;
  onProcess: () => void;
};

export function OcrInput({ value, onChange, onProcess }: OcrInputProps) {
  return (
    <div className="ocr-input-section">
      <label htmlFor="ocr-input">OCR Input</label>
      <textarea
        id="ocr-input"
        className="ocr-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onProcess();
          }
        }}
        placeholder="Paste OCR input here (3 lines per account, 27 characters per line)..."
        spellCheck={false}
      />
      <div style={{ marginTop: "0.75rem" }}>
        <button
          className="process-btn"
          onClick={onProcess}
          disabled={value.trim() === ""}
        >
          Process OCR
        </button>
        <span
          style={{ marginLeft: "0.75rem", fontSize: "0.8rem", color: "#6c757d" }}
        >
          or Ctrl+Enter
        </span>
      </div>
    </div>
  );
}
