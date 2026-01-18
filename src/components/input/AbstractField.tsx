import { Show, type JSX } from "solid-js";
import styles from "./AbstractField.module.css";

export default function AbstractField(props: {
  label: string;
  children: JSX.Element;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  dropdown?: JSX.Element;
  dropdownVisible?: boolean;
  labelFor?: string;
}) {
  return (
    <div class={styles.abstractField}>
      <div
        class={styles.abstractFieldBody}
        classList={{
          [styles.dropdown]:
            props.dropdown !== undefined && props.dropdownVisible,
        }}
      >
        <Show when={props.prefix !== undefined}>
          <div class={styles.abstractFieldBodyPrefix}>{props.prefix}</div>
        </Show>
        <div class={styles.abstractFieldBodyContent}>{props.children}</div>
        <Show when={props.suffix !== undefined}>
          <div class={styles.abstractFieldBodySuffix}>{props.suffix}</div>
        </Show>
      </div>

      <Show when={props.dropdown !== undefined && props.dropdownVisible}>
        <div class={styles.abstractFieldDropdown}>{props.dropdown}</div>
      </Show>

      <label for={props.labelFor} class={styles.abstractFieldLabel}>
        {props.label}
      </label>
    </div>
  );
}
