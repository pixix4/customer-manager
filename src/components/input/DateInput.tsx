import { createUniqueId, JSX } from "solid-js";
import styles from "./DateInput.module.css";
import AbstractField from "./AbstractField";
import Calendar from "./Calendar";

export default function DateInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}) {
  const id = createUniqueId();
  let inputElement!: HTMLInputElement;

  return (
    <AbstractField
      label={props.label}
      labelFor={id}
      prefix={props.prefix}
      suffix={props.suffix}
      dropdown={<Calendar value={props.value} onChange={props.onChange} />}
      dropdownVisible={true}
    >
      <div class={styles.number}>
        <input
          id={id}
          ref={inputElement}
          class={styles.dateInput}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </AbstractField>
  );
}
