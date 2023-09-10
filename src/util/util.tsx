import { DateTime } from "luxon";

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

  return DateTime.fromISO(date, { zone: "America/New_York" }).toISO({ includeOffset: false}).slice(0, -7);
};

/**
 * Parse date string from backend to human readable date format.
 */
export const parseDateString = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromISO(date, { zone: "America/New_York" }).toFormat("yyyy-MM-dd");
};

/**
 * Parse date string from human readable format to backend format
 * while keeping the time zone consistent.
 */
export const dateToServerFormat = (date?: string | null) => {
  if (date === undefined || date === null) {
    return "";
  }

  return DateTime.fromJSDate(new Date(date), { zone: "America/New_York" }).toISO();
};
