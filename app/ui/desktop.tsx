"use client";

import * as React from "react";
import { DesktopItem } from "./desktop-item";
import { StartMenu } from "./start-menu";
import styles from "./desktop.module.css";
import { useWindowsContext } from "./use-window-context";

export function Desktop({ children }: { children: React.ReactNode }) {
  const { openWindow } = useWindowsContext();
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
            onClick={() => openWindow("videos")}
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
