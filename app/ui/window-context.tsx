import * as React from "react";

type WindowContextValue = {
  windows: string[];
  focused: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
};

const WindowContext = React.createContext<WindowContextValue | null>(null);
WindowContext.displayName = "WindowContext";
export { WindowContext };
