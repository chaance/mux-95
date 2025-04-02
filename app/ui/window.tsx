"use client";
import * as React from "react";
import styles from "./window.module.css";
import { useDraggable } from "~/lib/use-draggable";
import { useWindowsContext } from "./use-window-context";
import cx from "clsx";
import { Button, type ButtonProps } from "./button";
import { type WindowType, WindowContext } from "./window-context";

const WindowsBox: React.FC<WindowsBoxProps> = (props) => {
  let { children, className, inset, depth = 2, ...domProps } = props;
  return (
    <div
      data-inset={inset ? "" : undefined}
      className={cx(className, styles.WindowsBox)}
      data-depth={depth}
      {...domProps}
    >
      {children}
    </div>
  );
};

interface WindowsBoxProps extends React.ComponentPropsWithRef<"div"> {
  inset?: boolean;
  depth?: 2 | 3 | 4;
}

interface WindowsWindowProps extends React.ComponentPropsWithRef<"div"> {}

const WindowsWindow: React.FC<WindowsWindowHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <WindowsBox
      className={cx(styles.WindowsWindow, className)}
      {...props}
      inset={false}
    >
      {children}
    </WindowsBox>
  );
};

interface WindowsWindowHeaderProps extends React.ComponentPropsWithRef<"div"> {}

const WindowsWindowHeader: React.FC<WindowsWindowHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cx(styles.WindowsWindowHeader, className)} {...props}>
      {children}
    </div>
  );
};

interface WindowsWindowBodyProps extends React.ComponentPropsWithRef<"div"> {}

const WindowsWindowBody: React.FC<WindowsWindowBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cx(styles.WindowsWindowBody, className)} {...props}>
      {children}
    </div>
  );
};

interface WindowsHeaderButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label: string;
}

const WindowsHeaderButton: React.FC<WindowsHeaderButtonProps> = ({
  className,
  icon,
  label,
  ...props
}) => {
  return (
    <Button
      type="button"
      className={cx(styles.WindowsHeaderButton, className)}
      aria-label={label}
      {...props}
    >
      <IconWindowsClose color="currentColor" />
    </Button>
  );
};

interface WindowProps {
  title: string;
  children: React.ReactNode;
  resizable?: boolean;
  height?: number;
  width?: number;
  positionX?: number;
  positionY?: number;
  windowId: string;
}

export function Window(props: WindowProps) {
  const { windows } = useWindowsContext();
  const window = windows.find((w) => w.id === props.windowId);
  if (!window) {
    return null;
  }

  return <WindowImpl {...props} window={window} />;
}

function WindowImpl({
  title,
  children,
  resizable,
  height = 300,
  width = 300,
  positionX,
  positionY,
  windowId,
  window,
}: WindowProps & { window: WindowType }) {
  const size = { height, width };
  const { windows, closeWindow, focus } = useWindowsContext();
  const openWindowCount = windows.length;
  let initialX = 50,
    initialY = 50;
  if (openWindowCount > 0) {
    if (positionX === undefined) {
      initialX += openWindowCount * 20;
    }
    if (positionY === undefined) {
      initialY += openWindowCount * 20;
    }
  }

  const { position, onDragInit } = useDraggable({ x: initialX, y: initialY });
  const index = windows.indexOf(window);
  const zIndex = windows.length + index;
  const windowRef = React.useRef<HTMLDivElement>(null);

  return (
    <WindowsWindow
      ref={windowRef}
      style={{
        // @ts-expect-error
        "--window-height": `${size.height}px`,
        "--window-width": `${size.width}px`,
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
      }}
      className={styles.Window}
      data-resizable={resizable || undefined}
    >
      <WindowsWindowHeader
        className={styles.titleBar}
        onPointerDown={(event) => {
          focus(windowId);
          onDragInit(event, windowRef.current);
        }}
      >
        <h2>{title}</h2>
        <WindowsHeaderButton
          label="Close window"
          icon={null}
          onClick={() => closeWindow(windowId)}
        />
      </WindowsWindowHeader>

      <WindowsWindowBody>
        <WindowContext value={window}>{children}</WindowContext>
      </WindowsWindowBody>
    </WindowsWindow>
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

interface IconProps extends React.ComponentPropsWithRef<"svg"> {
  color: string;
}

const IconWindowsClose: React.FC<IconProps> = ({ color, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M11.692 11.692L28.308 28.308M28.308 11.692L11.692 28.308"
      />
    </svg>
  );
};
