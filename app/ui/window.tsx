"use client";
import * as React from "react";
import styles from "./window.module.css";
import { useDraggable } from "~/lib/use-draggable";
import { useWindowState } from "./use-window-state";

export function Window({
  title,
  children,
  resizable,
  height = 300,
  width = 300,
  positionX = 50,
  positionY = 50,
  windowId,
}: {
  title: string;
  children: React.ReactNode;
  resizable?: boolean;
  height?: number;
  width?: number;
  positionX?: number;
  positionY?: number;
  windowId: string;
}) {
  const [sizeState, setSize] = React.useState({ height, width });
  const {
    position,
    handleMouseDown,
    // handleMouseMove,
    // handleMouseUp,
    isDragging,
  } = useDraggable({ x: positionX, y: positionY });
  const size = resizable ? sizeState : { height, width };
  React.useEffect(() => {
    if (!isDragging) {
      return;
    }
  }, []);
  const { windows, closeWindow } = useWindowState();
  const isOpen = windows.includes(windowId);
  const index = windows.indexOf(windowId);
  const zIndex = windows.length - index;
  return (
    <div
      style={{
        // @ts-expect-error
        "--window-height": `${size.height}px`,
        "--window-width": `${size.width}px`,
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "320px",
        zIndex,
      }}
      className={`${styles.Window} height-${size.height} width-${size.width}`}
      data-height={size.height}
      data-width={size.width}
      data-resizable={resizable || undefined}
      data-state={isOpen ? "open" : "closed"}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <ControlButton label="Minimize" icon={null} onClick={() => void 0} />
          <ControlButton label="Maximize" icon={null} onClick={() => void 0} />
          <ControlButton
            label="Close"
            icon={null}
            onClick={() => closeWindow(windowId)}
          />
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

function ControlButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.controlButton}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
