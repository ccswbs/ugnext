import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { Modal } from "@/components/modal";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { useDismissible } from "@/lib/use-dismissible";
import objectHash from "object-hash";
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
