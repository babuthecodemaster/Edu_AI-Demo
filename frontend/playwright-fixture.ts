import { test as base, expect } from "@playwright/test";

// Re-export Playwright's test and expect so tests can import from this file.
export const test = base;
export { expect };
