import {
  RiArrowsArrowLeftSFill,
  RiArrowsArrowRightSFill,
} from "solid-icons/ri";
import styles from "./Calendar.module.css";
import { createEffect, createSignal, For } from "solid-js";
import { getDateStringFromValues } from "../../datetime";
import {
  getTranslatedMonthLongArray,
  getTranslatedWeekDaysShortArray,
  useTranslation,
  WeekDayArray,
} from "../../translation";

type DateValue = {
  year: number;
  month: number;
};

function invalidToDefault(value: number, def: number): number {
  if (isNaN(value) || !isFinite(value)) {
    return def;
  }

  return value;
}

function createDateValue(value: string): DateValue {
  const now = new Date();
  const split = value.split("-");
  return {
    year: invalidToDefault(parseInt(split[0]), now.getFullYear()),
    month: invalidToDefault(parseInt(split[1]), now.getMonth() + 1),
  };
}

export default function Calendar(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();

  const weekDaysShort = getTranslatedWeekDaysShortArray(t);
  const monthsLong = getTranslatedMonthLongArray(t);

  const [selectedValue, setSelectedValue] = createSignal(
    createDateValue(props.value),
  );

  createEffect(() => {
    setSelectedValue(createDateValue(props.value));
  });

  const monthDetails = () => getMonthDetails(selectedValue(), 1, weekDaysShort);

  const showPreviousMonth = () => {
    const details = monthDetails();
    setSelectedValue({
      year: details.previousMonthYear,
      month: details.previousMonth,
    });
  };

  const showNextMonth = () => {
    const details = monthDetails();
    setSelectedValue({
      year: details.nextMonthYear,
      month: details.nextMonth,
    });
  };

  const monthGrid = () => {
    const split = props.value.split("-");

    return buildMonthGrid(
      monthDetails(),
      parseInt(split[0]),
      parseInt(split[1]),
      parseInt(split[2]),
    );
  };

  const selectDay = (details: DayDetails) => {
    props.onChange(
      getDateStringFromValues(details.year, details.month, details.day),
    );
  };

  return (
    <div class={styles.calendar}>
      <div class={styles.header}>
        <div class={styles.headerAction} onClick={showPreviousMonth}>
          <RiArrowsArrowLeftSFill />
        </div>
        <div class={styles.headerCenter}>
          {monthsLong[selectedValue().month - 1]} {selectedValue().year}
        </div>
        <div class={styles.headerAction} onClick={showNextMonth}>
          <RiArrowsArrowRightSFill />
        </div>
      </div>
      <table class={styles.calendarTable}>
        <thead>
          <tr>
            <For each={monthDetails().columnNames}>
              {(day) => <th>{day}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={monthGrid()}>
            {(week) => (
              <tr>
                <For each={week}>
                  {(day) => (
                    <td onClick={() => selectDay(day)}>
                      <span
                        class={styles.dayView}
                        classList={{
                          [styles.active]: day.active,
                          [styles.selected]: day.selected,
                        }}
                      >
                        {day.day}
                      </span>
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

type MonthDetails = {
  columnNames: string[];
  columnOfFirstDay: number; // 0..6 (relative to firstDayOfWeek)
  daysInMonth: number;
  daysInPreviousMonth: number;

  previousMonth: number; // 1..12
  previousMonthYear: number;

  currentMonth: number; // 1..12
  currentMonthYear: number;

  nextMonth: number; // 1..12
  nextMonthYear: number;
};

type DayDetails = {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  active: boolean; // true if in current month/year
  selected: boolean; // true if matches selected y/m/d
};

type WeeksGrid = DayDetails[][]; // 6 weeks x 7 days

function getMonthDetails(
  value: DateValue,
  firstDayOfWeek: number,
  weekDayArray: WeekDayArray,
): MonthDetails {
  const jsMonth = value.month - 1;

  // Month/year neighbors
  const previousMonth = value.month === 1 ? 12 : value.month - 1;
  const previousMonthYear = value.month === 1 ? value.year - 1 : value.year;

  const nextMonth = value.month === 12 ? 1 : value.month + 1;
  const nextMonthYear = value.month === 12 ? value.year + 1 : value.year;

  // Day counts
  const daysInMonth = new Date(value.year, jsMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(
    previousMonthYear,
    previousMonth,
    0,
  ).getDate(); // note: previousMonth is 1..12

  // Weekday of the 1st of the month in JS: 0=Sun..6=Sat
  const jsWeekdayOfFirst = new Date(value.year, jsMonth, 1).getDay();

  // Convert to column index relative to `firstDayOfWeek`
  const columnOfFirstDay = (jsWeekdayOfFirst - firstDayOfWeek + 7) % 7;

  // Column names rotated so index 0 is firstDayOfWeek
  const columnNames = Array.from(
    { length: 7 },
    (_, i) => weekDayArray[(firstDayOfWeek + i) % 7],
  );

  return {
    columnNames,
    columnOfFirstDay,
    daysInMonth,
    daysInPreviousMonth,
    previousMonth,
    previousMonthYear,
    currentMonth: value.month,
    currentMonthYear: value.year,
    nextMonth,
    nextMonthYear,
  };
}

function buildMonthGrid(
  details: MonthDetails,
  selectedYear: number,
  selectedMonth: number,
  selectedDay: number,
): WeeksGrid {
  const isSelected = (y: number, m: number, d: number) =>
    y === selectedYear && m === selectedMonth && d === selectedDay;

  const TOTAL_CELLS = 42; // 6 weeks * 7 days
  const lead = details.columnOfFirstDay; // number of prev-month days before the 1st

  const prevY = details.previousMonthYear;
  const prevM = details.previousMonth;
  const currY = details.currentMonthYear;
  const currM = details.currentMonth;
  const nextY = details.nextMonthYear;
  const nextM = details.nextMonth;

  const prevDays = details.daysInPreviousMonth;
  const currDays = details.daysInMonth;

  const cells: DayDetails[] = [];

  for (let i = 0; i < TOTAL_CELLS; i++) {
    let y: number;
    let m: number;
    let d: number;
    let active: boolean;

    if (i < lead) {
      // Tail of previous month
      y = prevY;
      m = prevM;
      d = prevDays - lead + 1 + i; // last `lead` days
      active = false;
    } else if (i < lead + currDays) {
      // Current month
      y = currY;
      m = currM;
      d = i - lead + 1;
      active = true;
    } else {
      // Head of next month
      y = nextY;
      m = nextM;
      d = i - (lead + currDays) + 1;
      active = false;
    }

    cells.push({
      year: y,
      month: m,
      day: d,
      active,
      selected: isSelected(y, m, d),
    });
  }

  // Chunk into 6 rows of 7
  const weeks: WeeksGrid = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return weeks;
}
