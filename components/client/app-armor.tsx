"use client";

import { useEffect, useState } from "react";
import { DismissibleAlert, DismissibleAlertProps } from "@uoguelph/react-components/dismissible-alert";
import unraw from "unraw";

function linkifyUrls(input: string) {
  const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s<]*)?/gi;

  return input.replace(urlRegex, (match) => {
    const href = match.startsWith("http://") || match.startsWith("https://") ? match : `https://${match}`;
    return `<a href="${href}">${match}</a>`;
  });
}

export async function getAlert(test = false) {
  const id = test ? "162" : "163";
  const res = await fetch(`https://uoguelph.apparmor.com/Notifications/Feeds/Javascript/?AlertID=${id}`);

  if (!res.ok) {
    console.error(`Failed to fetch AppArmor alert: ${res.statusText}`);
    return null;
  }

  const text = unraw(
    (await res.text())
      ?.replace(`document.getElementById('AppArmorAlertID_${id}').innerHTML = '`, "")
      ?.slice(0, -2)
      ?.trim()
  );

  // If after trimming the string is empty, return null because there is no active alert
  if (!text) {
    return null;
  }

  try {
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");

    const title = html.querySelector('[slot="subtitle"]')?.textContent;
    const description =
      html.querySelector('[slot="message"]')?.textContent ??
      `Please visit <a href="https://uoguelph.ca/campus-status">uoguelph.ca/campus-status</a> for more information.`;
    const timestamp = html
      .querySelector('[slot="footer"]')
      ?.textContent?.replace("Last updated", "")
      ?.slice(0, -1)
      ?.trim();

    if (!title || !description || !timestamp) {
      console.error(`Failed to parse AppArmor alert JSON`);
      return null;
    }

    return { title, description: linkifyUrls(description), timestamp };
  } catch (e) {
    console.error(`Failed to parse AppArmor alert JSON`);
    return null;
  }
}

export function AppArmor() {
  const [alert, setAlert] = useState<DismissibleAlertProps>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const test = searchParams.get("ens-test") === "true" || false;

    getAlert(test).then((alert) => {
      if (!alert) return;

      setAlert({
        title: alert.title,
        description: alert.description,
        timestamp: alert.timestamp,
      });
    });
  }, []);

  if (!alert) return <></>;

  return <DismissibleAlert {...alert} />;
}

export default AppArmor;
