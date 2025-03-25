"use client";
import * as React from "react";
import styles from "./window.module.css";
import { useDraggable } from "~/lib/use-draggable";

export function Window({
  title,
  children,
  resizable,
  height = 300,
  width = 300,
  positionX = 50,
  positionY = 50,
}: {
  title: string;
  children: React.ReactNode;
  resizable?: boolean;
  height?: number;
  width?: number;
  positionX?: number;
  positionY?: number;
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
      }}
      className={`${styles.Window} height-${size.height} width-${size.width}`}
      data-height={size.height}
      data-width={size.width}
      data-resizable={resizable || undefined}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <ControlButton label="Minimize" icon={null} onClick={() => void 0} />
          <ControlButton label="Maximize" icon={null} onClick={() => void 0} />
          <ControlButton label="Close" icon={null} onClick={() => void 0} />
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
