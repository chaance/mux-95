"use client";
import * as React from "react";
import { WindowsContext, type WindowType } from "./window-context";

interface WindowState {
  windows: WindowType[];
  focused: string | null;
}

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [{ windows, focused }, setWindowState] = React.useState<WindowState>({
    windows: [],
    focused: null,
  });
  const openWindow = React.useCallback((id: string, context?: any) => {
    setWindowState((state) => {
      let match = state.windows.find((w) => w.id === id);
      if (match) {
        // compare contexts
        if (Object.is(match.context, context)) {
          // same context, just re-focus
          return getFocusAction(id)(state);
        } else {
          return {
            windows: [
              ...state.windows.filter((w) => w.id !== id),
              { id, context },
            ],
            focused: id,
          };
        }
      }
      return { windows: [...state.windows, { id, context }], focused: id };
    });
  }, []);
  const closeWindow = React.useCallback((id: string) => {
    setWindowState((state) => {
      let match = state.windows.find((w) => w.id === id);
      if (!match) {
        return state;
      }

      const windows = state.windows.filter((w) => w.id !== id);
      const lastOpenWindow = windows[windows.length - 1];
      return {
        windows,
        focused:
          state.focused === id ? (lastOpenWindow?.id ?? null) : state.focused,
      };
    });
  }, []);
  const focus = React.useCallback((id: string) => {
    setWindowState(getFocusAction(id));
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
    <WindowsContext
      value={{ windows, focused, openWindow, closeWindow, blur, focus }}
    >
      {children}
    </WindowsContext>
  );
}

function getFocusAction(id: string) {
  return function focus(state: WindowState): WindowState {
    let match = state.windows.find((w) => w.id === id);
    if (!match || state.focused === id) {
      return state;
    }

    // move the window to the end of the array
    return {
      windows: state.windows.filter((w) => w.id !== id).concat(match),
      focused: id,
    };
  };
}
