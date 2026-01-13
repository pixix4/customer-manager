import {
  Accessor,
  createEffect,
  createSignal,
  createUniqueId,
  Index,
  Show,
} from "solid-js";
import styles from "./SelectBox.module.css";
import replaceSpecialCharacters from "replace-special-characters";
import { autofocus } from "@solid-primitives/autofocus";
import { useTranslation } from "../preferences";
// prevents from being tree-shaken by TS
autofocus;

export type SelectBoxPossibleValue = {
  id: string | number | null;
  name: string;
  additionalSearchTerms?: string[];
};

export default function SelectBox(props: {
  label: string;
  selected: string | number | null;
  onSelect: (id: string | number | null) => void;
  possibleValues: SelectBoxPossibleValue[];
  autofocus?: boolean;
}) {
  const t = useTranslation();

  const id = createUniqueId();

  const [search, setSearch] = createSignal("");
  const [hasFocus, setHasFocus] = createSignal(false);
  const [activeRow, setActiveRow] = createSignal(0);

  let inputElement!: HTMLInputElement;
  const itemRefs = [] as HTMLDivElement[];

  createEffect(() => {
    const index = activeRow();
    const el = itemRefs[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  const selectedValue = () => {
    return props.possibleValues.find((v) => v.id === props.selected);
  };

  const filteredAutoComplete = () => {
    const searchValue = search();
    if (searchValue.length === 0) {
      return props.possibleValues;
    }

    const s = replaceSpecialCharacters(searchValue).toLowerCase();
    return props.possibleValues.filter((v) => {
      if (replaceSpecialCharacters(v.name).toLowerCase().includes(s)) {
        return true;
      }
      for (let term of v.additionalSearchTerms ?? []) {
        if (replaceSpecialCharacters(term).toLowerCase().includes(s)) {
          return true;
        }
      }

      return false;
    });
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
          props.onSelect(filtered[active].id);
          setActiveRow(0);
          inputElement.blur();
        }
        break;
      case "Escape":
        if (search().length === 0) {
          inputElement.blur();
        }
        break;
    }
  };

  const autoCompleteClickHandler = (data: Accessor<SelectBoxPossibleValue>) => {
    props.onSelect(data().id);
    inputElement.blur();
  };

  const autoCompleteEnterHandler = (data: number) => {
    setActiveRow(data);
  };

  return (
    <div class={styles.selectBox} classList={{ [styles.focused]: hasFocus() }}>
      <div
        class={styles.selectBoxDisplay}
        classList={{ [styles.placeholder]: selectedValue() === undefined }}
        onClick={() => inputElement.focus()}
      >
        {selectedValue()?.name ?? "---"}
      </div>
      <label for={id} class={styles.selectBoxLabel}>
        {props.label}
      </label>
      <div class={styles.selectBoxDropDown}>
        <div class={styles.selectBoxSearchContainer}>
          <input
            id={id}
            ref={(el) => (inputElement = el)}
            use:autofocus={props.autofocus}
            autofocus={props.autofocus}
            class={styles.selectBoxSearch}
            classList={{
              [styles.canAutoComplete]: hasFocus(),
            }}
            type="search"
            placeholder={t("general.searchPlaceholder")}
            value={search()}
            autocapitalize="off"
            autocorrect="off"
            onInput={(e) => setSearch(e.currentTarget.value)}
            onKeyDown={keyDownHandler}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
        </div>
        <Show when={hasFocus()}>
          <div class={styles.selectBoxAutoComplete}>
            <Index each={filteredAutoComplete()}>
              {(entry, index) => (
                <div
                  ref={(el) => (itemRefs[index] = el)}
                  class={styles.selectBoxAutoCompleteEntry}
                  classList={{ [styles.active]: index === activeRow() }}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={[autoCompleteClickHandler, entry]}
                  onPointerEnter={[autoCompleteEnterHandler, index]}
                >
                  {entry().name}
                </div>
              )}
            </Index>
          </div>
        </Show>
      </div>
    </div>
  );
}
