  import React from "react";
  import ReactDOM from "react-dom";
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore: @axe-core/react might not be installed during this run
    import("@axe-core/react").then(({ default: axe }) => {
      axe(React, ReactDOM, 1000);
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
  