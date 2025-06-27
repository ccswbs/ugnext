import { useEffect, useState } from "react";
import { getAlert } from "@/lib/app-armor";
import { DismissibleAlert } from "@uoguelph/react-components/dismissible-alert";

export function AppArmor({ test = false }) {
  const [alert, setAlert] = useState();

  useEffect(() => {
    getAlert(test).then((alert) => {
      if (!alert) return;

      setAlert({
        title: alert.title,
        description: alert.description,
        timestamp: alert.time,
      });
    });
  }, [test]);

  return <DismissibleAlert alert={alert} />;
}

export default AppArmor;
