# Bank OCR

A TypeScript application that parses OCR-style bank account numbers, validates checksums, detects illegible and invalid accounts, and supports repair logic with ambiguity handling.

Based on the [Bank OCR kata](https://codingdojo.org/kata/BankOCR/).

## Quick start

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm test         # Run all tests
```

## Architecture

```
src/
  domain/                    # Pure business logic (UI-agnostic)
    types.ts                 # Shared domain types
    process.ts               # Orchestrator: parse → validate → repair → result
    examples.ts              # Predefined OCR examples for the UI
    ocr/
      digits.ts              # Digit patterns, recognition, segment toggling
      parser.ts              # OCR line parsing into digits and accounts
    account/
      checksum.ts            # Checksum validation
      status.ts              # Account status evaluation (OK/ERR/ILL)
    repair/
      repair.ts              # Repair logic for ILL/ERR accounts
  components/                # React UI components
    ExampleLoader.tsx        # Predefined example buttons
    OcrInput.tsx             # OCR textarea + process button
    ResultPanel.tsx          # Result cards with details
    StatusBadge.tsx          # Colored status badge
    DigitBreakdown.tsx       # Visual digit-by-digit breakdown
  styles/
    app.css                  # All styles
  __tests__/                 # Domain logic tests
    digits.test.ts
    parser.test.ts
    checksum.test.ts
    status.test.ts
    process.test.ts
  App.tsx                    # Root component
  main.tsx                   # Entry point
```

## Design decisions

- **Vitest** chosen for testing — it shares Vite's transform pipeline, needs zero extra config, and is fast.
- **Segment-based repair**: each digit is modeled as 7 segments in a 3×3 grid. Repair toggles one segment at a time and checks if the result is a valid digit + valid checksum.
- **Checksum direction**: the rightmost digit has weight 1, leftmost has weight 9, per the kata spec.
- **Domain types over classes**: all domain logic uses plain typed objects and pure functions.
