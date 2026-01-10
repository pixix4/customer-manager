import { For, JSX, Match, Switch } from "solid-js";
import styles from "./ToolBar.module.css";

export type ToolBarEntry =
  | {
      type: "button";
      icon: JSX.Element;
      action: () => void;
    }
  | {
      type: "label";
      label: string;
    }
  | {
      type: "spacer";
    };

export default function ToolBar(props: { entries: ToolBarEntry[] }) {
  const action = (e: MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();

    action();
  };

  return (
    <div class={styles.toolBar}>
      <For each={props.entries}>
        {(entry) => (
          <Switch>
            <Match when={matches(entry, (e) => e.type === "button")}>
              {(item) => (
                <button onClick={(e) => action(e, item().action)}>
                  {item().icon}
                </button>
              )}
            </Match>
            <Match when={matches(entry, (e) => e.type === "label")}>
              {(item) => <span>{item().label}</span>}
            </Match>
            <Match when={matches(entry, (e) => e.type === "spacer")}>
              <figure></figure>
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}

function matches<S extends T, T = unknown>(
  e: T,
  predicate: (e: T) => e is S
): S | false {
  return predicate(e) ? e : false;
}
