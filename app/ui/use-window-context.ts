import * as React from "react";
import {
  WindowsContext,
  WindowContext,
  type WindowType,
} from "./window-context";

export function useWindowsContext() {
  const ctx = React.use(WindowsContext);
  if (ctx === null) {
    throw new Error(
      "useWindowsContext must be used within a WindowsContext provider",
    );
  }
  return ctx;
}

export function useWindowContext(): WindowType<unknown>;
export function useWindowContext<P extends Predicate<any>>(
  predicate: P,
): WindowType<ReturnType<P>>;

export function useWindowContext(predicate?: Predicate<any>) {
  const window = React.use(WindowContext);
  if (window === null) {
    throw new Error(
      "useWindowContext must be used within a WindowContext provider",
    );
  }

  if (typeof predicate === "function") {
    if (!predicate(window.context)) {
      throw new TypeError("Window context value does not match predicate");
    }
    return window;
  }

  return window;
}

interface Predicate<T> {
  (value: unknown): value is T;
  (value: unknown): unknown;
}
