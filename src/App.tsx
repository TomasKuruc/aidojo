import { useState } from "react";
import type { ProcessedAccountResult } from "./domain/types";
import type { OcrExample } from "./domain/examples";
import { processOcrInput } from "./domain/process";
import { ExampleLoader } from "./components/ExampleLoader";
import { OcrInput } from "./components/OcrInput";
import { ResultPanel } from "./components/ResultPanel";

export function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<readonly ProcessedAccountResult[]>([]);

  function handleProcess() {
    if (input.trim() === "") return;
    setResults(processOcrInput(input));
  }

  function handleExampleSelect(example: OcrExample) {
    setInput(example.input);
    setResults(processOcrInput(example.input));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bank OCR</h1>
        <p>Parse, validate, and repair OCR-scanned bank account numbers</p>
      </header>

      <ExampleLoader onSelect={handleExampleSelect} />
      <OcrInput value={input} onChange={setInput} onProcess={handleProcess} />
      <ResultPanel results={results} />
    </div>
  );
}
