// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

// vitest-axe ships no auto-registering entry point for Vitest 5: we register the
// matchers ourselves, and declare their types in src/vitest-axe.d.ts.
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);
