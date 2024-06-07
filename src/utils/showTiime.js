const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function showTime(time, min) {
  if (!time) return;
  const now = Date.now();
  if (now - new Date(time).getTime() < 86400000) {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (
    now - new Date(time).getTime() > 86400000 &&
    now - new Date(time).getTime() < 86400000 * 7
  ) {
    return (
      days[new Date(time).getDay()] +
      " " +
      (min
        ? ""
        : new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }))
    );
  } else {
    return (
      new Date(time).toLocaleDateString() +
      " " +
      (min
        ? ""
        : new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }))
    );
  }
}
