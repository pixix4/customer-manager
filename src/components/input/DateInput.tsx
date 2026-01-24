import { createEffect, createSignal, createUniqueId, JSX } from "solid-js";
import styles from "./DateInput.module.css";
import AbstractField from "./AbstractField";
import Calendar from "./Calendar";
import { getDateStringFromDate, getDateStringFromValues } from "../../datetime";

type EditField = "year" | "month" | "day";

type DateValue = {
  year: number;
  month: number;
  day: number;
};

const MIN_YEAR = 1800;
const MAX_YEAR = 2999;

function invalidToZero(value: number): number {
  if (isNaN(value) || !isFinite(value)) {
    return 0;
  }

  return value;
}

function createDateValue(value: string): DateValue {
  const split = value.split("-");
  return {
    year: invalidToZero(parseInt(split[0])),
    month: invalidToZero(parseInt(split[1])),
    day: invalidToZero(parseInt(split[2])),
  };
}

export default function DateInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}) {
  const id = createUniqueId();

  const [selectedValue, setSelectedValue] = createSignal<DateValue>(
    createDateValue(props.value),
  );
  const [activeEditField, setActiveEditField] = createSignal<
    [EditField, number]
  >(["day", 0]);

  createEffect(() => {
    setSelectedValue(createDateValue(props.value));
  });

  createEffect(() => {
    const current = activeEditField();
    switch (current[0]) {
      case "year":
        if (current[1] >= 4) {
          const current = validateDate(selectedValue());
          const dateString = getDateStringFromValues(
            current.year,
            current.month,
            current.day,
          );
          props.onChange(dateString);
          setActiveEditField(["year", 0]);
        }

        break;
      case "month":
        if (current[1] >= 2) {
          setActiveEditField(["year", 0]);
        }

        break;
      case "day":
        if (current[1] >= 2) {
          setActiveEditField(["month", 0]);
        }

        break;
    }
  });

  const onDigitPressed = (digit: number) => {
    const current = activeEditField();

    switch (current[0]) {
      case "year":
        if (current[1] === 0) {
          setSelectedValue((v) => ({
            ...v,
            year: digit,
          }));
        } else {
          setSelectedValue((v) => ({
            ...v,
            year: v.year * 10 + digit,
          }));
        }

        break;
      case "month":
        if (current[1] === 0) {
          setSelectedValue((v) => ({
            ...v,
            month: digit,
          }));
        } else {
          setSelectedValue((v) => ({
            ...v,
            month: v.month * 10 + digit,
          }));
        }

        break;
      case "day":
        if (current[1] === 0) {
          setSelectedValue((v) => ({
            ...v,
            day: digit,
          }));
        } else {
          setSelectedValue((v) => ({
            ...v,
            day: v.day * 10 + digit,
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
          if (current[0] === "year") {
            return ["month", 0];
          }
          if (current[0] === "month") {
            return ["day", 0];
          }

          return current;
        });

        break;
      case "ArrowRight":
        e.preventDefault();

        setActiveEditField((current) => {
          if (current[0] === "day") {
            return ["month", 0];
          }
          if (current[0] === "month") {
            return ["year", 0];
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

  const dateString = () => {
    const current = selectedValue();
    return getDateStringFromValues(current.year, current.month, current.day);
  };

  return (
    <AbstractField
      label={props.label}
      labelFor={id}
      prefix={props.prefix}
      suffix={props.suffix}
      dropdown={<Calendar value={dateString()} onChange={props.onChange} />}
      dropdownVisible={true}
    >
      <div
        class={styles.dateInput}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPaste={handleOnPaste}
      >
        <DateEntry
          value={selectedValue().day}
          digits={2}
          placeholder="D"
          active={activeEditField()[0] === "day"}
          onClick={() => setActiveEditField(["day", 0])}
          inputProgress={activeEditField()[1]}
        />
        .
        <DateEntry
          value={selectedValue().month}
          digits={2}
          placeholder="M"
          active={activeEditField()[0] === "month"}
          onClick={() => setActiveEditField(["month", 0])}
          inputProgress={activeEditField()[1]}
        />
        .
        <DateEntry
          value={selectedValue().year}
          digits={4}
          placeholder="Y"
          active={activeEditField()[0] === "year"}
          onClick={() => setActiveEditField(["year", 0])}
          inputProgress={activeEditField()[1]}
        />
      </div>
    </AbstractField>
  );
}

function DateEntry(props: {
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
      class={styles.dateEntry}
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

function isLeapYear(year: number): boolean {
  // Gregorian leap year rules
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function daysInMonth(year: number, month: number): number {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

function isValidMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

function isValidDay(day: number): boolean {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

/**
 * returns a validated date.
 * - year must be 1800..2999, month 1..12, day 1..maxDay
 * - if year or month invalid => ALL values set to 0
 * - if day invalid => rounded/clamped to nearest valid day within month/year
 */
export function validateDate(value: DateValue): DateValue {
  const { year, month, day } = value;

  // If year/month invalid, zero out everything (as requested)
  if (!isValidYear(year) || !isValidMonth(month)) {
    return { year: 0, month: 0, day: 0 };
  }

  // If day is not an integer or outside 1..31, we'll clamp as well.
  // Clamp to the month/year max day (nearest valid day number).
  const maxDay = daysInMonth(year, month);

  // If it's not even in the broad 1..31 range, still clamp to nearest within 1..maxDay.
  // (Your spec says "problem with the day number" => round to nearest valid day number)
  if (!isValidDay(day)) {
    const clamped = Math.min(Math.max(Math.trunc(day), 1), maxDay);
    return { year, month, day: clamped };
  }

  // Day is 1..31, but might exceed maxDay for this month/year => clamp down
  const clampedDay = Math.min(day, maxDay);
  return { year, month, day: clampedDay };
}

/**
 * Increments one field by 1.
 * Overflow behavior:
 * - day overflow => increment month; if month overflows => increment year
 * - month overflow => increment year
 * Notes:
 * - returns {0,0,0} if resulting year/month become invalid (same policy as validateDate)
 * - day is clamped to month/year after changing month/year
 */
export function increment(value: DateValue, field: EditField): DateValue {
  // Work on a validated base. If invalid year/month => zero.
  const base = validateDate(value);
  if (base.year === 0 && base.month === 0 && base.day === 0) return base;

  let { year, month, day } = base;

  if (field === "day") {
    day += 1;
    const maxDay = daysInMonth(year, month);
    if (day > maxDay) {
      day = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  } else if (field === "month") {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  } else {
    year += 1;
  }

  // After changing month/year, clamp day to valid range for that month/year
  return validateDate({ year, month, day });
}

/**
 * Decrements one field by 1.
 * Underflow behavior:
 * - day underflow => decrement month; if month underflows => decrement year
 * - month underflow => decrement year
 * Notes:
 * - returns {0,0,0} if resulting year/month become invalid (same policy as validateDate)
 * - day is clamped to month/year after changing month/year; for day underflow we jump to last day of prev month
 */
export function decrement(value: DateValue, field: EditField): DateValue {
  const base = validateDate(value);
  if (base.year === 0 && base.month === 0 && base.day === 0) return base;

  let { year, month, day } = base;

  if (field === "day") {
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      // If year became invalid, validateDate will zero it out
      if (isValidYear(year) && isValidMonth(month)) {
        day = daysInMonth(year, month);
      } else {
        // Keep day as-is; validateDate will return zeros anyway if year/month invalid
        day = 0;
      }
    }
  } else if (field === "month") {
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
  } else {
    year -= 1;
  }

  return validateDate({ year, month, day });
}
