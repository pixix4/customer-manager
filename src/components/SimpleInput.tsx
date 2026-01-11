import { createUniqueId } from "solid-js";
import styles from "./SimpleInput.module.css";

export default function SimpleInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "date" | "time" | "number";
}) {
  const id = createUniqueId();

  const onChange = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) => {
    props.onChange(e.currentTarget.value);
  };

  return (
    <div class={styles.simpleInput}>
      <input
        id={id}
        class={styles.simpleInputInput}
        type={props.type}
        value={props.value ?? ""}
        onInput={onChange}
      />
      <label for={id} class={styles.simpleInputLabel}>
        {props.label}
      </label>
    </div>
  );
}
