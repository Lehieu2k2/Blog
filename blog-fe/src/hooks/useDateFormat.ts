import dayjs from "dayjs";

export default function useDateFormat(value: string, format = "DD/MM/YYYY") {
  if (!value) {
    return dayjs().format(format);
  }
  return dayjs(value).format(format);
}
