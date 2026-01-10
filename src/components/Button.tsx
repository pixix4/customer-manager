import { JSX } from "solid-js";
import styles from "./Button.module.css";

export default function Button(props: {
  onClick?: () => void;
  color?: "default" | "primary" | "danger";
  disabled?: boolean;
  children: JSX.Element;
}) {
  return (
    <button
      class={styles.button}
      classList={{
        [styles.primary]: props.color === "primary",
        [styles.danger]: props.color === "danger",
      }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
