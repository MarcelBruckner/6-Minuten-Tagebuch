import moment, { Moment } from "moment";

export function formatDate(date: Date | undefined | Moment = undefined) {
  if (!date) {
    date = new Date();
  }
  if (date instanceof Date) {
    date = moment(date);
  }
  return date.format("YYYY-MM-DD");
}

export function parseDate(date: string | Date) {
  if (!isDate(date)) {
    return undefined;
  }
  if (date instanceof Date) {
    return date;
  }
  return moment(date, "YYYY-MM-DD").toDate();
}

export function isDate(date: string | Date) {
  if (date instanceof Date) {
    return true;
  }
  return moment(date, "YYYY-MM-DD").isValid();
}
