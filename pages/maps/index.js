import { Layout } from "@/components/layout";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Tabs } from "@/components/tabs";
import { faMapMarkerAlt, faSearch, faDirections } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useHeaderHeight } from "@/lib/use-header-height";

export default function Maps() {
  const panels = [
    { title: "Legend", icon: faMapMarkerAlt, content: <>Legend</> },
    { title: "Search", icon: faSearch, content: <>Search</> },
    { title: "Directions", icon: faDirections, content: <>Directions</> },
  ];

  const [activePanel, setActivePanel] = useState(null);
  const headerHeight = useHeaderHeight();

  return (
    <Layout metadata={{ title: "Campus Map" }} className="flex flex-col-reverse pb-0 lg:flex-row" footer={false}>
      <div className="flex flex-col lg:w-96 lg:h-auto">
        <div className="flex h-16 justify-center items-center bg-red">Test</div>
      </div>

      <div
        className="flex-1 h-[calc(100vh_-_var(--header-height)_-_theme(spacing.16))] lg:h-auto"
        style={{ "--header-height": headerHeight + "px" }}
      >
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
