import moment from "moment";

export function formatDate(date: Date | undefined = undefined) {
  if (!date) {
    date = new Date();
  }
  return moment(date).format("YYYY-MM-DD");
}
