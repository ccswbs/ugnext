import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { Modal } from "@/components/modal";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { useDismissible } from "@/lib/use-dismissible";
import objectHash from "object-hash";

const AppArmor = () => {
  const { isPreview, pathname } = useRouter();
  const id = pathname === "/app-armor-test" || isPreview ? 168 : 169;
  const ref = useRef(null);
  const [alert, setAlert] = useState(null);
  const [show, setShow] = useState(true);
  const hash = useMemo(() => {
    return alert ? objectHash(alert) : null;
  }, [alert]);
  const { dismissed, dismiss, clear } = useDismissible("app-armor-alert", hash, "session");

  return (
    <>
      <div id={`AppArmorAlertID_${id}`} ref={ref}></div>

      <Script
        strategy="afterInteractive"
        src={`https://uoguelph.apparmor.com/Notifications/Feeds/Javascript/?AlertID=${id}`}
        onLoad={() => {
          const child = ref.current.firstChild;

          try {
            setAlert(JSON.parse(child.textContent));
          } catch (e) {
            clear();
          }
        }}
      ></Script>

      {alert && !dismissed && (
        <Modal open={show} onClose={() => setShow(false)}>
          <Container centered className="p-0 !max-w-[80rem]">
            <Alert
              title="University of Guelph Alert"
              subtitle={alert.title}
              message={alert.description}
              footer={
                <div className="flex flex-col gap-2 md:flex-row items-center justify-between w-full">
                  <span>{`Last Updated: ${alert.time}`}</span>
                  <Button
                    color="red"
                    className="py-2"
                    onClick={() => {
                      setShow(false);
                      dismiss();
                    }}
                  >
                    Don&apos;t show me this again
                  </Button>
                </div>
              }
            />
          </Container>
        </Modal>
      )}
    </>
  );
};

export default AppArmor;
