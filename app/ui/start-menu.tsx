"use client";
import * as React from "react";
import styles from "./start-menu.module.css";

export function StartMenu({ className }: { className?: string }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = React.useState(false);
  return (
    <div className={`${className || ""} ${styles.StartMenu}`.trim()}>
      <button
        type="button"
        className={styles.startButton}
        onClick={() => setIsStartMenuOpen((o) => !o)}
        data-state={isStartMenuOpen ? "open" : "closed"}
      >
        Start
      </button>
      {isStartMenuOpen && (
        <div className={styles.menu}>
          <div className={styles.menuInner}>
            <StartMenuItem>Programs</StartMenuItem>
            <StartMenuItem>Documents</StartMenuItem>
            <StartMenuItem>Settings</StartMenuItem>
            <StartMenuItem>Shut Down</StartMenuItem>
          </div>
        </div>
      )}
    </div>
  );
}

function StartMenuItem({ children }: { children: React.ReactNode }) {
  return <div className={styles.menuItem}>{children}</div>;
}
