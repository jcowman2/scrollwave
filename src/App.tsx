import React from "react";

import EditPage from "./pages/edit/EditPage";
import { Route } from "./common/enum";
import FullPage from "./common/FullPage";
import ViewPage from "./pages/view/ViewPage";
import { ReaderData } from "./common/common.types";

const DEBUG = true;
const DEBUG_READER_DATA = new ReaderData(
  [
    { id: "b1", spans: [{ id: "1s1", text: "Leaflets" }] },
    {
      id: "b2",
      spans: [
        {
          id: "2s1",
          text: "At dusk they pour from the sky."
        },
        {
          id: "2s2",
          text:
            "They blow across the ramparts, turn cartwheels over rooftops, flutter into the ravines between houses. Entire streets swirl with them, flashing white against the cobbles. Urgent message to the inhabitants of this town, they say. Depart immediately to open country."
        }
      ]
    },
    {
      id: "b3",
      spans: [
        {
          id: "3s1",
          text:
            "The tide climbs. The moon hangs small and yellow and gibbous. On the rooftops of beachfront hotels to the east, and in the gardens behind them, a half-dozen American artillery units drop incendiary rounds into the mouths of mortars."
        }
      ]
    }
  ],
  { length: 20000 }
);

function App() {
  const [route, setRoute] = React.useState(Route.EDIT);
  const [readerData, setReaderData] = React.useState<ReaderData>();

  if (DEBUG && route !== Route.VIEW) {
    setRoute(Route.VIEW);
    setReaderData(DEBUG_READER_DATA);
  }

  let currentPage;
  switch (route) {
    case Route.EDIT:
      currentPage = (
        <EditPage
          onWatch={(readerData: ReaderData) => {
            setRoute(Route.VIEW);
            setReaderData(readerData);
          }}
        />
      );
      break;
    case Route.VIEW:
      currentPage = <ViewPage readerData={readerData!} />;
      break;
    default:
      currentPage = <FullPage />;
  }

  return currentPage;
}

export default App;
