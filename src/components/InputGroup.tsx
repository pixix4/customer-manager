import { JSX } from "solid-js";
import styles from "./InputGroup.module.css";

export default function TextInput(props: {
  children: JSX.Element | JSX.Element[];
}) {
  return <div class={styles.inputGroup}>{props.children}</div>;
}
