import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

import { __clearTestStateCache } from "../app/context/LearnerContext";

configure({ asyncUtilTimeout: 5000 });

// Happy DOM 21 creates Animation.finished rejections even when Motion uses
// onfinish instead of consuming that promise. Use Motion's JavaScript driver
// for component tests; real native animations remain covered in browser E2E.
// This changes capability detection rather than swallowing unhandled errors.
if (typeof Element !== "undefined") {
  Reflect.deleteProperty(Element.prototype, "animate");
}

afterEach(() => {
  cleanup();
  __clearTestStateCache();
  // Modals portal into <body> and toggle `inert` on #root; make sure one test's
  // leftover DOM cannot make the next test's queries pass or fail spuriously.
  if (typeof document !== "undefined") document.body.innerHTML = "";
});
import "fake-indexeddb/auto";
