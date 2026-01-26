import { createUniqueId, JSX } from "solid-js";
import styles from "./NumberInput.module.css";
import { RiArrowsArrowDownSFill, RiArrowsArrowUpSFill } from "solid-icons/ri";
import AbstractField from "./AbstractField";

const MAX = 999_999_999;
const MIN = -999_999_999;

function validateValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function NumberInput(props: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  decimalPlaces?: number;
  increment?: number;
  min?: number;
  max?: number;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}) {
  const id = createUniqueId();
  let inputElement!: HTMLInputElement;

  const onDigitPressed = (digit: number) => {
    let newValue = props.value * 10 + (Math.sign(props.value) || 1) * digit;
    props.onChange(validateValue(newValue, props.min ?? MIN, props.max ?? MAX));
  };

  const onBackspace = () => {
    let newValue =
      Math.sign(props.value) * Math.floor(Math.abs(props.value / 10));
    props.onChange(validateValue(newValue, props.min ?? MIN, props.max ?? MAX));
  };

  const onNegate = () => {
    let newValue = -props.value;
    props.onChange(validateValue(newValue, props.min ?? MIN, props.max ?? MAX));
  };

  const onIncrement = (incrementOverride?: number) => {
    inputElement?.focus();
    let offset = incrementOverride ?? props.increment ?? 1;
    let newValue = props.value + offset;
    props.onChange(validateValue(newValue, props.min ?? MIN, props.max ?? MAX));
  };

  const onDecrement = (incrementOverride?: number) => {
    inputElement?.focus();
    let offset = incrementOverride ?? props.increment ?? 1;
    let newValue = props.value - offset;
    props.onChange(validateValue(newValue, props.min ?? MIN, props.max ?? MAX));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "0":
        e.preventDefault();
        onDigitPressed(0);
        break;
      case "1":
        e.preventDefault();
        onDigitPressed(1);
        break;
      case "2":
        e.preventDefault();
        onDigitPressed(2);
        break;
      case "3":
        e.preventDefault();
        onDigitPressed(3);
        break;
      case "4":
        e.preventDefault();
        onDigitPressed(4);
        break;
      case "5":
        e.preventDefault();
        onDigitPressed(5);
        break;
      case "6":
        e.preventDefault();
        onDigitPressed(6);
        break;
      case "7":
        e.preventDefault();
        onDigitPressed(7);
        break;
      case "8":
        e.preventDefault();
        onDigitPressed(8);
        break;
      case "9":
        e.preventDefault();
        onDigitPressed(9);
        break;
      case "Backspace":
        e.preventDefault();
        onBackspace();
        break;
      case "-":
        e.preventDefault();
        onNegate();
        break;
      case "ArrowUp":
        e.preventDefault();
        onIncrement();
        break;
      case "ArrowDown":
        e.preventDefault();
        onDecrement();
        break;
      case "PageUp":
        e.preventDefault();
        onIncrement(10);
        break;
      case "PageDown":
        e.preventDefault();
        onDecrement(10);
        break;
    }
  };

  const handleOnPaste = (e: ClipboardEvent) => {
    e.preventDefault();

    let newValue = parseFloat(
      e.clipboardData?.getData("Text").replace(",", ".") ?? "",
    );
    let places = props.decimalPlaces ?? 0;

    if (places > 0) {
      newValue = newValue * Math.pow(10, places);
    }
    props.onChange(
      validateValue(Math.round(newValue), props.min ?? MIN, props.max ?? MAX),
    );
  };

  let stringValue = () =>
    (props.value / Math.pow(10, props.decimalPlaces ?? 0)).toFixed(
      props.decimalPlaces ?? 0,
    );

  return (
    <AbstractField
      label={props.label}
      labelFor={id}
      prefix={props.prefix}
      suffix={props.suffix}
    >
      <div class={styles.number}>
        <input
          id={id}
          ref={inputElement}
          class={styles.numberInput}
          value={stringValue()}
          onKeyDown={handleKeyDown}
          onPaste={handleOnPaste}
          onChange={() => {}}
        />
        <div class={styles.numberActions}>
          <div
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onIncrement(props.increment ?? 1)}
          >
            <RiArrowsArrowUpSFill />
          </div>
          <div
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onDecrement(props.increment ?? 1)}
          >
            <RiArrowsArrowDownSFill />
          </div>
        </div>
      </div>
    </AbstractField>
  );
}
