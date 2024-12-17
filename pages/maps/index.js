import { Layout } from "@/components/layout";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { faMapMarkerAlt, faSearch, faDirections } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { twJoin } from "tailwind-merge";
import { useMediaQuery } from "@material-ui/core";
import { Legend } from "@/components/maps/legend";
import { Search } from "@/components/maps/search";
import { Directions } from "@/components/maps/directions";

export default function Maps() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activePanel, setActivePanel] = useState(null);
  const panels = useMemo(
    () => [
      { title: "Legend", icon: faMapMarkerAlt, content: <Legend /> },
      { title: "Search", icon: faSearch, content: <Search /> },
      { title: "Directions", icon: faDirections, content: <Directions /> },
    ],
    []
  );

  useEffect(() => {
    if (isDesktop && activePanel === null) {
      setActivePanel(0);
    }
  }, [activePanel, isDesktop, panels]);

  return (
    <Layout
      metadata={{ title: "Campus Map" }}
      className="flex flex-col-reverse pb-0 md:flex-row"
      footer={false}
      header={{
        topic: {
          title: "Campus Map",
          url: "/maps",
        },
        navigation: [
          { title: "Locations Directory", url: "/maps/locations" },
          { title: "Directions", url: "/maps/directions" },
        ],
      }}
    >
      {/* Panels */}
      <div className="flex flex-col md:w-72 md:h-auto relative">
        {/* Panel Selector */}
        <div className="flex h-16 md:h-12 justify-center items-center bg-red">
          {panels.map((panel, index) => (
            <button
              key={panel.title}
              className={twJoin(
                "flex flex-col md:flex-row p-2 items-center justify-center h-full gap-2 flex-1 text-white first:border-r first:border-black/15 last:border-black/15 last:border-l",
                activePanel === index && "bg-red-800"
              )}
              onClick={() => {
                if (!isDesktop) {
                  activePanel === index ? setActivePanel(null) : setActivePanel(index);
                } else {
                  setActivePanel(index);
                }
              }}
            >
              <FontAwesomeIcon icon={panel.icon} className="text-lg" />
              <span className="text-xs">{panel.title}</span>
            </button>
          ))}
        </div>

        {/* Panel Container */}
        <div
          className={twJoin(
            "absolute bottom-full bg-white z-10 w-full md:static md:h-full transition-[height]",
            activePanel === null
              ? "h-0 overflow-hidden"
              : "h-[calc(100dvh_-_var(--header-height)_-_theme(spacing.16))] p-4"
          )}
        >
          {activePanel !== null && panels[activePanel].content}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 h-[calc(100dvh_-_var(--header-height)_-_theme(spacing.16))] md:h-auto">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            className="h-full w-full"
            defaultCenter={{ lat: 43.53105851613827, lng: -80.22708156317158 }}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
            defaultZoom={16}
            gestureHandling={"greedy"}
            disableDefaultUI
          />
        </APIProvider>
      </div>
    </Layout>
  );
}
