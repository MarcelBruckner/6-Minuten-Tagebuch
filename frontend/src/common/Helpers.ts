import moment from "moment";
import { QUOTES } from "../strings/Quotes";
export function formatDate(date: Date | undefined = undefined) {
  if (!date) {
    date = new Date();
  }
  return moment(date).format("YYYY-MM-DD");
}

export function parseDate(date: string) {
  if (!isDate(date)) {
    return undefined;
  }
  return moment(date, "YYYY-MM-DD");
}

export function isDate(date: string) {
  return moment(date, "YYYY-MM-DD").isValid();
}

export function get_random_quote(): string {
  const random = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[random];
}
