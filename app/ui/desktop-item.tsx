import styles from "./desktop-item.module.css";

interface DesktopItemProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function DesktopItem({ icon, label, onClick }: DesktopItemProps) {
  return (
    <div className={styles.DesktopItem} onClick={onClick}>
      <div className={styles.icon}>
        <img
          src={icon || "/icons/window.png"}
          alt=""
          className={styles.image}
        />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
