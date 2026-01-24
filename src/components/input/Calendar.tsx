import {
  RiArrowsArrowLeftSFill,
  RiArrowsArrowRightSFill,
} from "solid-icons/ri";
import styles from "./Calendar.module.css";
import { createEffect, createSignal, For } from "solid-js";
import { getDateString } from "../../datetime";
import {
  getTranslatedMonthLongArray,
  getTranslatedWeekDaysShortArray,
  useTranslation,
  WeekDayArray,
} from "../../preferences";

export default function Calendar(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslation();

  const weekDaysShort = getTranslatedWeekDaysShortArray(t);
  const monthsLong = getTranslatedMonthLongArray(t);

  const [selectedYear, setSelectedYear] = createSignal(0);
  const [selectedMonth, setSelectedMonth] = createSignal(0);

  createEffect(() => {
    const split = props.value.split("-");
    setSelectedYear(parseInt(split[0]));
    setSelectedMonth(parseInt(split[1]));
  });

  const monthDetails = () =>
    getMonthDetails(selectedYear(), selectedMonth(), 1, weekDaysShort);

  const showPreviousMonth = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const details = monthDetails();
    setSelectedYear(details.previousMonthYear);
    setSelectedMonth(details.previousMonth);
  };

  const showNextMonth = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const details = monthDetails();
    setSelectedYear(details.nextMonthYear);
    setSelectedMonth(details.nextMonth);
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

  const selectDay = (event: MouseEvent, details: DayDetails) => {
    event.preventDefault();
    event.stopPropagation();

    props.onChange(getDateString(details.year, details.month, details.day));
  };

  return (
    <div class={styles.calendar}>
      <div class={styles.header}>
        <div class={styles.headerAction} onMouseDown={showPreviousMonth}>
          <RiArrowsArrowLeftSFill />
        </div>
        <div class={styles.headerCenter}>
          {monthsLong[selectedMonth() - 1]} {selectedYear()}
        </div>
        <div class={styles.headerAction} onMouseDown={showNextMonth}>
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
                    <td onMouseDown={(e) => selectDay(e, day)}>
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
  year: number,
  month: number,
  firstDayOfWeek: number,
  weekDayArray: WeekDayArray,
): MonthDetails {
  const jsMonth = month - 1;

  // Month/year neighbors
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousMonthYear = month === 1 ? year - 1 : year;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextMonthYear = month === 12 ? year + 1 : year;

  // Day counts
  const daysInMonth = new Date(year, jsMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(
    previousMonthYear,
    previousMonth,
    0,
  ).getDate(); // note: previousMonth is 1..12

  // Weekday of the 1st of the month in JS: 0=Sun..6=Sat
  const jsWeekdayOfFirst = new Date(year, jsMonth, 1).getDay();

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
    currentMonth: month,
    currentMonthYear: year,
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
