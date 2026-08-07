import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // Modals portal into <body> and toggle `inert` on #root; make sure one test's
  // leftover DOM cannot make the next test's queries pass or fail spuriously.
  document.body.innerHTML = "";
});
