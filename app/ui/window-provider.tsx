"use client";
import * as React from "react";
import { WindowContext } from "./window-context";

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [{ windows, focused }, setWindowState] = React.useState({
    windows: [] as string[],
    focused: null as string | null,
  });
  const openWindow = React.useCallback((id: string) => {
    setWindowState((state) => {
      if (state.windows.includes(id)) {
        return state;
      }
      return { windows: [...windows, id], focused: id };
    });
  }, []);
  const closeWindow = React.useCallback((id: string) => {
    setWindowState((state) => {
      if (!state.windows.includes(id)) {
        return state;
      }
      const windows = state.windows.filter((w) => w !== id);
      const lastOpenWindow = windows[windows.length - 1];
      return {
        windows: state.windows.filter((w) => w !== id),
        focused:
          state.focused === id ? (lastOpenWindow ?? null) : state.focused,
      };
    });
  }, []);
  return (
    <WindowContext value={{ windows, focused, openWindow, closeWindow }}>
      {children}
    </WindowContext>
  );
}
