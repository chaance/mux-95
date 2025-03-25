import * as React from "react";
import { WindowContext } from "./window-context";

export function useWindowState() {
  const ctx = React.use(WindowContext);
  if (ctx === null) {
    throw new Error("useWindowState must be used within a WindowProvider");
  }
  return ctx;
}
