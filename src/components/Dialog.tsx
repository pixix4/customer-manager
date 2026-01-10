import { RiSystemCloseLine } from "solid-icons/ri";
import styles from "./Dialog.module.css";
import { JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

export type DialogSize = "small" | "medium" | "large";

export default function Dialog(props: {
  show: boolean;
  setShow?: (show: boolean) => void;
  title: string;
  children: JSX.Element;
  size?: DialogSize;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const size = () => props.size ?? "medium";

  return (
    <Show when={props.show}>
      <Portal>
        <div class={styles.dialogWrapper}>
          <div
            class={styles.dialogBackdrop}
            onClick={() => props.setShow?.(false)}
          ></div>
          <div
            class={styles.dialogWindow}
            classList={{
              [styles.small]: size() === "small",
              [styles.medium]: size() === "medium",
              [styles.large]: size() === "large",
            }}
          >
            <div class={styles.dialogHeader}>
              <Show when={props.actionLabel}>
                <button
                  class={`${styles.dialogHeaderAction} ${styles.dialogHeaderButton}`}
                  onClick={() => props.onAction?.()}
                >
                  {props.actionLabel}
                </button>
              </Show>

              <span>{props.title}</span>

              <Show when={props.setShow !== undefined}>
                <button
                  class={`${styles.dialogHeaderClose} ${styles.dialogHeaderButton}`}
                  onClick={() => props.setShow?.(false)}
                >
                  <RiSystemCloseLine />
                </button>
              </Show>
            </div>
            <div class={styles.dialogContent}>{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
