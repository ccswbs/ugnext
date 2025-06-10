// FormatDate give it a date formated as time (from Drupal)

export function FormatDateFull(time) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

export function FormatEventDate(time) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export function FormatEventWeekday(time) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  return formattedDate;
}

export function FormatEventMonth(time) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
  });

  return formattedDate;
}

export function FormatEventDay(time) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
  });

  return formattedDate;
}
