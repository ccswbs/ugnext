"use client";

import { useEffect, useState } from "react";

const AVERAGE_READING_SPEED = 200;

export function NewsTimeEstimate() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const content = document.getElementById("uofg-news-article-content");

    if (!content) return;

    const words = content.textContent.split(/\s+/).length;
    const minutes = Math.ceil(words / AVERAGE_READING_SPEED);

    setTime(minutes);
  });

  return <span className="pr-4">{time} min read</span>;
}
