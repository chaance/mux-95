import * as React from "react";
import cx from "clsx";
import styles from "./button.module.css";

const Button: React.FC<ButtonProps> = ({
  children,
  type: buttonType = "button",
  className,
  onPointerDown,
  ...props
}) => {
  let [metaPress, setMetaPress] = React.useState(false);
  React.useEffect(() => {
    if (!metaPress) {
      return;
    }

    let listener = () => {
      setMetaPress(false);
    };
    window.addEventListener("pointerup", listener);
    return () => {
      window.removeEventListener("pointerup", listener);
    };
  }, [metaPress]);

  return (
    <button
      type={buttonType}
      className={cx(styles.Button, className)}
      data-meta-pressed={metaPress ? "" : undefined}
      onPointerDown={(event) => {
        if (event.metaKey) {
          setMetaPress(true);
        }
        onPointerDown?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";

interface ButtonProps extends React.ComponentPropsWithRef<"button"> {}

export type { ButtonProps };
export { Button };
