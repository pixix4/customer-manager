import { createUniqueId } from "solid-js";
import styles from "./DateInput.module.css";

export default function DateInput(props: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const id = createUniqueId();

  const onChange = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) => {
    const value = e.currentTarget.value;
    if (!value) {
      props.onChange(null);
    } else {
      props.onChange(value);
    }
  };

  return (
    <div class={styles.dateInput}>
      <input
        id={id}
        class={styles.dateInputInput}
        type="date"
        min="1900-01-01"
        value={props.value ?? ""}
        onInput={onChange}
      />
      <label for={id} class={styles.dateInputLabel}>
        {props.label}
      </label>
    </div>
  );
}
