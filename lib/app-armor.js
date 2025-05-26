export async function getAlert(test = false) {
  const id = test ? "168" : "173";
  const res = await fetch(`https://uoguelph.apparmor.com/Notifications/Feeds/Javascript/?AlertID=${id}`);
  const text = await res.text();
  const data = text
    ?.replace(`document.getElementById('AppArmorAlertID_${id}').innerHTML = '\\u003c!--`, "")
    ?.replace(` --\\u003e';`, "")
    ?.replaceAll("\\", "")
    ?.trim();

  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
