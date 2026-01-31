import styles from "./MessageBox.module.css";
import { For, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import Button, { ButtonColor } from "./Button";

export type MessageBoxButton = {
  label: string;
  onAction: () => void;
  color?: ButtonColor;
};

export default function MessageBox(props: {
  show: boolean;
  setShow?: (show: boolean) => void;
  title: string;
  children: JSX.Element;
  actions: MessageBoxButton[];
}) {
  function handleAction(action: MessageBoxButton) {
    action.onAction();
    if (props.setShow) {
      props.setShow(false);
    }
  }

  return (
    <Show when={props.show}>
      <Portal>
        <div class={styles.messageBoxWrapper}>
          <div class={styles.messageBoxBackdrop}></div>
          <div class={styles.messageBoxWindow}>
            <div class={styles.messageBoxHeader}>
              <span>{props.title}</span>
            </div>
            <div class={styles.messageBoxContent}>{props.children}</div>
            <div class={styles.messageBoxFooter}>
              <For each={props.actions}>
                {(action) => (
                  <Button
                    onClick={() => handleAction(action)}
                    color={action.color}
                  >
                    {action.label}
                  </Button>
                )}
              </For>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
