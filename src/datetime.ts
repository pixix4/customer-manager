type DateString = `${number}-${number}-${number}`; // YYYY-MM-DD
type TimeString = `${number}:${number}`; // HH:mm
type DateTimeString =
  `${number}-${number}-${number}T${number}:${number}:${number}`; // YYYY-MM-DDTHH:mm:ss

function isValidDateString(date: string): date is DateString {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTimeString(time: string): time is TimeString {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const [hh, mm] = time.split(":").map(Number);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

function parseDateTimePartsSafe(
  datetime: string
): { date: DateString; hh: string; mm: string; ss: string } | null {
  const m = datetime.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!m) return null;

  const date = m[1];
  if (!isValidDateString(date)) return null;

  return {
    date,
    hh: m[2],
    mm: m[3],
    ss: m[4] ?? "00",
  };
}

/** 1) get date string out of datetime */
export function getDateFromDateTime(datetime: string): DateString | "" {
  const parts = parseDateTimePartsSafe(datetime);
  return parts ? parts.date : "";
}

/** 2) get time string out of datetime */
export function getTimeFromDateTime(datetime: string): TimeString | "" {
  const parts = parseDateTimePartsSafe(datetime);
  return parts ? (`${parts.hh}:${parts.mm}` as TimeString) : "";
}

/** 3) update datetime based on previous value and new date string */
export function updateDateTimeWithDate(
  prevDateTime: string,
  newDate: string
): DateTimeString | string {
  if (!isValidDateString(newDate)) return prevDateTime;

  const parts = parseDateTimePartsSafe(prevDateTime);
  if (!parts) return prevDateTime;

  return `${newDate}T${parts.hh}:${parts.mm}:${parts.ss}` as DateTimeString;
}

/** 4) update datetime based on previous value and new time string */
export function updateDateTimeWithTime(
  prevDateTime: string,
  newTime: string
): DateTimeString | string {
  if (!isValidTimeString(newTime)) return prevDateTime;

  const parts = parseDateTimePartsSafe(prevDateTime);
  if (!parts) return prevDateTime;

  const [hh, mm] = newTime.split(":");
  return `${parts.date}T${hh}:${mm}:${parts.ss}` as DateTimeString;
}

/** Returns the current local datetime as YYYY-MM-DDTHH:mm:ss */
export function getCurrentDateTime(): DateTimeString {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}` as DateTimeString;
}

/** Formats a number of minutes into "X h Y min" */
export function formatMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
    return "0 min";
  }

  const minutes = Math.floor(totalMinutes);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} h`);
  }

  if (mins > 0) {
    parts.push(`${mins} min`);
  }

  // Handles the case where minutes > 0 but hours === 0
  if (parts.length === 0) {
    return "0 min";
  }

  return parts.join(" ");
}

/** Formats a number of days into "X weeks" or "X days" */
export function formatDays(days: number | null): string {
  if (days === null) {
    return "---";
  }

  if (!Number.isFinite(days) || days <= 0) {
    return "0 days";
  }

  const d = Math.floor(days);

  if (d % 7 === 0) {
    const weeks = d / 7;
    return `${weeks} week${weeks === 1 ? "" : "s"}`;
  }

  return `${d} day${d === 1 ? "" : "s"}`;
}
