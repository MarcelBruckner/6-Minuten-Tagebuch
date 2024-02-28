import moment, { Moment } from "moment";

export function formatDate(date: Date | undefined | Moment | string = undefined) {
  return parseDate(date).format("YYYY-MM-DD");
}

export function formatWeek(date: Date | undefined | Moment | string = undefined) {
  return parseDate(date).format("YYYY-WW");
}

export function parseDate(date: string | Date | undefined | Moment) {
  if (!date) {
    date = new Date();
  }
  if (date instanceof Date) {
    date = moment(date);
  }
  if (typeof date === "string") {
    date = moment(date, "YYYY-MM-DD");
  }
  return date;
}

export function isDate(date: string | Date) {
  if (date instanceof Date) {
    return true;
  }
  return moment(date, "YYYY-MM-DD").isValid();
}

export function weekToDate(date: Date | string | undefined) {
  return formatDate(moment(date, "YYYY-WW"));
}
