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
  const focus = React.useCallback((id: string) => {
    setWindowState((state) => {
      if (!state.windows.includes(id) || state.focused === id) {
        return state;
      }

      // move the window to the end of the array
      return {
        windows: state.windows.filter((w) => w !== id).concat(id),
        focused: id,
      };
    });
  }, []);
  const blur = React.useCallback(() => {
    setWindowState((state) => {
      if (state.focused === null) {
        return state;
      }

      return {
        windows: state.windows,
        focused: null,
      };
    });
  }, []);
  return (
    <WindowContext
      value={{ windows, focused, openWindow, closeWindow, blur, focus }}
    >
      {children}
    </WindowContext>
  );
}
