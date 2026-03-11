import { OCR_EXAMPLES, type OcrExample } from "../domain/examples";

type ExampleLoaderProps = {
  onSelect: (example: OcrExample) => void;
};

export function ExampleLoader({ onSelect }: ExampleLoaderProps) {
  return (
    <div className="example-loader">
      <label>Load example</label>
      <div className="example-buttons">
        {OCR_EXAMPLES.map((example) => (
          <button
            key={example.label}
            className="example-btn"
            onClick={() => onSelect(example)}
            title={example.description}
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
