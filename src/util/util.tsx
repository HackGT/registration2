import { DateTime } from "luxon";

/** it CANNOT be this hard to convert a timezone, but it is. */
export function forceEasternTime(date: Date) {
  // get offset of a timezone
  function getStandardOffsetMinutes(_d: Date, timeZone: string) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const p = Object.fromEntries(dtf.formatToParts(_d).map(x => [x.type, x.value]));
    const asUTC = Date.UTC(
      parseInt(p.year),
      parseInt(p.month) - 1,
      parseInt(p.day),
      p.hour === '24'? 0 : parseInt(p.hour),
      parseInt(p.minute), 
      parseInt(p.second)
    );
    return (asUTC - _d.getTime()) / 60000;
  }

  const localOffset = -date.getTimezoneOffset();
  const easternOffset = getStandardOffsetMinutes(date, 'America/New_York');
  const diffMs = (localOffset - easternOffset) * 60000;
  return new Date(date.getTime() + diffMs);
}

/**
 * Parse date string from backend to human readable date/time format.
 */
export const parseDateTimeString = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromISO(date, { zone: "America/New_York" }).toLocaleString(
    DateTime.DATETIME_SHORT
  );
};

/**
 * Parse date string from backend to form required date/time format.
 */
export const parseDateTimeForm = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromISO(date, { zone: "America/New_York" })
    .toISO({ includeOffset: false })
    .slice(0, -7);
};

/**
 * Parse date string from backend to human readable date format.
 */
export const parseDateString = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromISO(date, { zone: "America/New_York" }).toFormat("yyyy-MM-dd'T'HH:mm");
};

/**
 * Parse date string from human readable format to backend format
 * while keeping the time zone consistent.
 */
export const dateToServerFormat = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromJSDate(
    forceEasternTime(new Date(date)),
    { zone: "America/New_York" }
  ).toISO();
};
