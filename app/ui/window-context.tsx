import * as React from "react";

export interface WindowType<Ctx = unknown> {
  id: string;
  context: Ctx;
}

type WindowsContextValue = {
  windows: WindowType[];
  focused: string | null;
  openWindow: (id: string, context?: any) => void;
  closeWindow: (id: string) => void;
  focus: (id: string) => void;
  blur: () => void;
};

const WindowsContext = React.createContext<WindowsContextValue | null>(null);
WindowsContext.displayName = "WindowsContext";

const WindowContext = React.createContext<WindowType | null>(null);
WindowContext.displayName = "WindowContext";

export { WindowsContext, WindowContext };
