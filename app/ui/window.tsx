import type * as React from "react";
import styles from "./window.module.css";

export function Window({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.Window}>
      <div className={styles.titleBar}>
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
