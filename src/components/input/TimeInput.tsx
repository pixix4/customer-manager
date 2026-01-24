import { createEffect, createSignal, createUniqueId, JSX } from "solid-js";
import styles from "./TimeInput.module.css";
import AbstractField from "./AbstractField";
import { getDateStringFromDate, getTimeStringFromValues } from "../../datetime";

type EditField = "hour" | "minute";

type TimeValue = {
  hour: number;
  minute: number;
};

function invalidToDefault(value: number, def: number): number {
  if (isNaN(value) || !isFinite(value)) {
    return def;
  }

  return value;
}

function createDateValue(value: string): TimeValue {
  const split = value.split(":");
  return {
    hour: invalidToDefault(parseInt(split[0]), 8),
    minute: invalidToDefault(parseInt(split[1]), 0),
  };
}

export default function TimeInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}) {
  const id = createUniqueId();

  const [selectedValue, setSelectedValue] = createSignal<TimeValue>(
    createDateValue(props.value),
  );
  const [activeEditField, setActiveEditField] = createSignal<
    [EditField, number]
  >(["hour", 0]);

  createEffect(() => {
    setSelectedValue(createDateValue(props.value));
  });

  createEffect(() => {
    const current = activeEditField();
    switch (current[0]) {
      case "hour":
        if (current[1] >= 2) {
          setActiveEditField(["minute", 0]);
        }

        break;
      case "minute":
        if (current[1] >= 2) {
          const current = validateTime(selectedValue());
          const dateString = getTimeStringFromValues(
            current.hour,
            current.minute,
          );
          props.onChange(dateString);
          setActiveEditField(["minute", 0]);
        }

        break;
    }
  });

  const onDigitPressed = (digit: number) => {
    const current = activeEditField();

    switch (current[0]) {
      case "hour":
        if (current[1] === 0) {
          setSelectedValue((v) => ({
            ...v,
            hour: digit,
          }));
        } else {
          setSelectedValue((v) => ({
            ...v,
            hour: v.hour * 10 + digit,
          }));
        }

        break;
      case "minute":
        if (current[1] === 0) {
          setSelectedValue((v) => ({
            ...v,
            minute: digit,
          }));
        } else {
          setSelectedValue((v) => ({
            ...v,
            minute: v.minute * 10 + digit,
          }));
        }

        break;
    }

    setActiveEditField((current) => {
      return [current[0], current[1] + 1];
    });
  };

  const onBackspace = () => {
    setActiveEditField((current) => {
      if (current[1] !== 0) {
        return [current[0], 0];
      }

      return current;
    });
  };

  const onIncrement = () => {
    const current = activeEditField();

    setSelectedValue((v) => increment(v, current[0]));

    setActiveEditField((current) => {
      if (current[1] !== 0) {
        return [current[0], 0];
      }

      return current;
    });
  };

  const onDecrement = () => {
    const current = activeEditField();

    setSelectedValue((v) => decrement(v, current[0]));

    setActiveEditField((current) => {
      if (current[1] !== 0) {
        return [current[0], 0];
      }

      return current;
    });
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
      case "ArrowUp":
        e.preventDefault();
        onIncrement();
        break;
      case "ArrowDown":
        e.preventDefault();
        onDecrement();
        break;
      case "ArrowLeft":
        e.preventDefault();

        setActiveEditField((current) => {
          if (current[0] === "minute") {
            return ["hour", 0];
          }

          return current;
        });

        break;
      case "ArrowRight":
        e.preventDefault();

        setActiveEditField((current) => {
          if (current[0] === "hour") {
            return ["minute", 0];
          }

          return current;
        });

        break;
    }
  };

  const handleOnPaste = (e: ClipboardEvent) => {
    e.preventDefault();

    const value = e.clipboardData?.getData("Text") ?? "";
    props.onChange(getDateStringFromDate(new Date(value)));
  };

  return (
    <AbstractField
      label={props.label}
      labelFor={id}
      prefix={props.prefix}
      suffix={props.suffix}
    >
      <div
        class={styles.timeInput}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handleOnPaste}
      >
        <TimeEntry
          value={selectedValue().hour}
          digits={2}
          placeholder="H"
          active={activeEditField()[0] === "hour"}
          onClick={() => setActiveEditField(["hour", 0])}
          inputProgress={activeEditField()[1]}
        />
        :
        <TimeEntry
          value={selectedValue().minute}
          digits={2}
          placeholder="M"
          active={activeEditField()[0] === "minute"}
          onClick={() => setActiveEditField(["minute", 0])}
          inputProgress={activeEditField()[1]}
        />
      </div>
    </AbstractField>
  );
}

function TimeEntry(props: {
  value: number;
  digits: number;
  placeholder: string;
  active: boolean;
  onClick: () => void;
  inputProgress: number;
}) {
  const displayValue = () => {
    if (props.value <= 0 && (props.inputProgress === 0 || !props.active)) {
      return props.placeholder.repeat(props.digits);
    }

    return props.value.toString().padStart(props.digits, "0");
  };

  return (
    <span
      class={styles.timeEntry}
      classList={{
        [styles.active]: props.active,
        [styles.inactive]: props.value <= 0,
      }}
      onClick={props.onClick}
    >
      {displayValue()}
    </span>
  );
}

function isValidHour(hour: number): boolean {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23;
}

function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 0 && minute <= 59;
}

/**
 * Returns a validated time.
 * - hour must be 0..23, minute must be 0..59
 * - if there is any problem with hour OR minute => all values set to 0
 */
export function validateTime(value: TimeValue): TimeValue {
  const { hour, minute } = value;

  if (!isValidHour(hour) || !isValidMinute(minute)) {
    return { hour: 0, minute: 0 };
  }

  return { hour, minute };
}

/**
 * Increments one field by 1.
 * Overflow behavior:
 * - minute overflow => increment hour
 * - hour overflow wraps to 0
 *
 * Note: If input is invalid, returns {0,0}
 */
export function increment(value: TimeValue, field: EditField): TimeValue {
  const base = validateTime(value);
  // If invalid -> it becomes {0,0}. We keep that.
  if (
    base.hour === 0 &&
    base.minute === 0 &&
    (!isValidHour(value.hour) || !isValidMinute(value.minute))
  ) {
    return base;
  }

  let { hour, minute } = base;

  if (field === "minute") {
    minute += 1;
    if (minute > 59) {
      minute = 0;
      hour += 1;
      if (hour > 23) hour = 0;
    }
  } else {
    hour += 1;
    if (hour > 23) hour = 0;
  }

  return validateTime({ hour, minute });
}

/**
 * Decrements one field by 1.
 * Underflow behavior:
 * - minute underflow => decrement hour
 * - hour underflow wraps to 23
 *
 * Note: If input is invalid, returns {0,0}
 */
export function decrement(value: TimeValue, field: EditField): TimeValue {
  const base = validateTime(value);
  if (
    base.hour === 0 &&
    base.minute === 0 &&
    (!isValidHour(value.hour) || !isValidMinute(value.minute))
  ) {
    return base;
  }

  let { hour, minute } = base;

  if (field === "minute") {
    minute -= 1;
    if (minute < 0) {
      minute = 59;
      hour -= 1;
      if (hour < 0) hour = 23;
    }
  } else {
    hour -= 1;
    if (hour < 0) hour = 23;
  }

  return validateTime({ hour, minute });
}
