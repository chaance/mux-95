"use client";

import * as React from "react";
import { DesktopItem } from "./desktop-item";
import { StartMenu } from "./start-menu";
import styles from "./desktop.module.css";
import { useWindowState } from "./use-window-state";

export function Desktop({ children }: { children: React.ReactNode }) {
  const { openWindow } = useWindowState();
  return (
    <div className={styles.Desktop}>
      <div className={styles.main}>
        <div className={styles.icons}>
          <DesktopItem
            icon="/icons/my-computer.png"
            label="My Computer"
            onClick={() => {}}
          />
          <DesktopItem
            icon="/icons/folder.png"
            label="Videos"
            // TODO
            onClick={() => void 0}
          />
          <DesktopItem
            icon="/icons/media-player.png"
            label="Media Player"
            // TODO
            onClick={() => openWindow("media-player")}
          />
        </div>
        {children}
      </div>
      <StartMenu className={styles.startMenu} />
    </div>
  );
}
