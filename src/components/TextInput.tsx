import {
  Accessor,
  createEffect,
  createSignal,
  createUniqueId,
  Index,
  Show,
} from "solid-js";
import styles from "./TextInput.module.css";
import replaceSpecialCharacters from "replace-special-characters";

export default function TextInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  autoComplete?: string[];
}) {
  const id = createUniqueId();

  const [hasFocus, setHasFocus] = createSignal(false);
  const [activeRow, setActiveRow] = createSignal(0);

  const itemRefs = [] as HTMLDivElement[];

  createEffect(() => {
    const index = activeRow();
    const el = itemRefs[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  const filteredAutoComplete = () => {
    const s = replaceSpecialCharacters(props.value).toLowerCase();

    if (props.autoComplete === undefined) {
      return [];
    }

    return props.autoComplete.filter((v) =>
      replaceSpecialCharacters(v).toLowerCase().includes(s)
    );
  };

  const canAutoComplete = () => {
    var possibleEntries = filteredAutoComplete();
    if (possibleEntries.length === 0) {
      return false;
    }

    if (possibleEntries.length === 1 && possibleEntries[0] === props.value) {
      return false;
    }

    return true;
  };

  const keyDownHandler = (event: KeyboardEvent) => {
    const pageSize = 10;
    const filtered = filteredAutoComplete();
    const active = activeRow();

    switch (event.code) {
      case "ArrowUp":
        if (active > 0) {
          setActiveRow((a) => a - 1);
        } else {
          setActiveRow(filtered.length - 1);
        }
        break;
      case "ArrowDown":
        if (active < filtered.length - 1) {
          setActiveRow((a) => a + 1);
        } else {
          setActiveRow(0);
        }
        break;
      case "PageUpd":
        if (active > 0) {
          setActiveRow((a) => Math.max(0, a - pageSize));
        } else {
          setActiveRow(filtered.length - 1);
        }
        break;
      case "PageDown":
        if (active < filtered.length - 1) {
          setActiveRow((a) => Math.min(a + pageSize, filtered.length - 1));
        } else {
          setActiveRow(0);
        }
        break;
      case "Enter":
        if (active >= 0 && active < filtered.length) {
          props.onChange(filtered[active]);
          setActiveRow(0);
        }
        break;
    }
  };

  const autoCompleteClickHandler = (data: Accessor<string>) => {
    props.onChange(data());
  };

  const autoCompleteEnterHandler = (data: number) => {
    setActiveRow(data);
  };

  return (
    <div class={styles.textInput}>
      <Show
        when={props.rows && props.rows > 1}
        fallback={
          <input
            id={id}
            class={styles.textInputInput}
            classList={{
              [styles.canAutoComplete]: canAutoComplete() && hasFocus(),
            }}
            type="text"
            value={props.value}
            onInput={(e) => props.onChange(e.currentTarget.value)}
            onKeyDown={keyDownHandler}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
        }
      >
        <textarea
          id={id}
          class={styles.textInputInput}
          classList={{
            [styles.canAutoComplete]: canAutoComplete() && hasFocus(),
          }}
          rows={props.rows}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      </Show>
      <label for={id} class={styles.textInputLabel}>
        {props.label}
      </label>
      <Show when={canAutoComplete() && hasFocus()}>
        <div class={styles.textInputAutoComplete}>
          <Index each={filteredAutoComplete()}>
            {(entry, index) => (
              <div
                ref={(el) => (itemRefs[index] = el)}
                class={styles.textInputAutoCompleteEntry}
                classList={{ [styles.active]: index === activeRow() }}
                onPointerDown={(e) => e.preventDefault()}
                onClick={[autoCompleteClickHandler, entry]}
                onPointerEnter={[autoCompleteEnterHandler, index]}
              >
                {entry()}
              </div>
            )}
          </Index>
        </div>
      </Show>
    </div>
  );
}
