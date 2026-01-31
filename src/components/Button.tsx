import { JSX } from "solid-js";
import styles from "./Button.module.css";

export type ButtonColor = "default" | "primary" | "danger" | "flat";

export default function Button(props: {
  onClick?: () => void;
  color?: ButtonColor;
  disabled?: boolean;
  children: JSX.Element;
}) {
  return (
    <button
      class={styles.button}
      classList={{
        [styles.primary]: props.color === "primary",
        [styles.danger]: props.color === "danger",
        [styles.flat]: props.color === "flat",
      }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
