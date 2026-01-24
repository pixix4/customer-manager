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
  datetime: string,
): { date: DateString; hh: string; mm: string; ss: string } | null {
  const m = datetime.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
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

export function getDateFromDateTime(datetime: string): DateString | "" {
  const parts = parseDateTimePartsSafe(datetime);
  return parts ? parts.date : "";
}

export function getTimeFromDateTime(datetime: string): TimeString | "" {
  const parts = parseDateTimePartsSafe(datetime);
  return parts ? (`${parts.hh}:${parts.mm}` as TimeString) : "";
}

export function updateDateTimeWithDate(
  prevDateTime: string,
  newDate: string,
): DateTimeString | string {
  if (!isValidDateString(newDate)) return prevDateTime;

  const parts = parseDateTimePartsSafe(prevDateTime);
  if (!parts) return prevDateTime;

  return `${newDate}T${parts.hh}:${parts.mm}:${parts.ss}` as DateTimeString;
}

export function updateDateTimeWithTime(
  prevDateTime: string,
  newTime: string,
): DateTimeString | string {
  if (!isValidTimeString(newTime)) return prevDateTime;

  const parts = parseDateTimePartsSafe(prevDateTime);
  if (!parts) return prevDateTime;

  const [hh, mm] = newTime.split(":");
  return `${parts.date}T${hh}:${mm}:${parts.ss}` as DateTimeString;
}

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

export function getDateString(
  year: number,
  month: number,
  day: number,
): DateString {
  const yyyy = year.toString().padStart(4, "0");
  const mm = month.toString().padStart(2, "0");
  const dd = day.toString().padStart(2, "0");

  return `${yyyy}-${mm}-${dd}` as DateString;
}

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

  if (parts.length === 0) {
    return "0 min";
  }

  return parts.join(" ");
}

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
