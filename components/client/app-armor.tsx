"use client";

import { useEffect, useState } from "react";
import { DismissibleAlert } from "@uoguelph/react-components/dismissible-alert";

export type Alert = {
  title: string;
  description: string;
  timestamp: string;
};

export async function getAlert(test = false) {
  const id = test ? "168" : "173";
  const res = await fetch(`https://uoguelph.apparmor.com/Notifications/Feeds/Javascript/?AlertID=${id}`);

  if (!res.ok) {
    console.error(`Failed to fetch AppArmor alert: ${res.statusText}`);
    return null;
  }

  const text = await res.text();
  const data = text
    ?.replace(`document.getElementById('AppArmorAlertID_${id}').innerHTML = '';`, "")
    ?.replace(`document.getElementById('AppArmorAlertID_${id}').innerHTML = '\\u003c!--`, "")
    ?.replace(` --\\u003e';`, "")
    ?.replaceAll("\\", "")
    ?.trim();

  // If after trimming the string is empty, return null because there is no active alert
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Failed to parse AppArmor alert JSON`);
    return null;
  }
}

export function AppArmor() {
  const [alert, setAlert] = useState<Alert>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const test = searchParams.get("ens-test") === "true" || false;

    getAlert(test).then((alert) => {
      if (!alert) return;

      setAlert({
        title: alert.title,
        description: alert.description,
        timestamp: alert.time,
      });
    });
  }, []);

  return <DismissibleAlert alert={alert} />;
}

export default AppArmor;
