import "@testing-library/jest-dom/vitest";

// vitest-axe has no auto-registering entry point for Vitest 5: register them here.
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);
