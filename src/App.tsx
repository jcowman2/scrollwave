import React from "react";

import EditPage from "./pages/edit/EditPage";
import { Route } from "./common/enum";
import FullPage from "./common/FullPage";
import ViewPage from "./pages/view/ViewPage";
import { ReaderData } from "./common/common.types";

function App() {
  const [route, setRoute] = React.useState(Route.EDIT);
  const [readerData, setReaderData] = React.useState<ReaderData>();

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
      currentPage = <ViewPage readerData={readerData} />;
      break;
    default:
      currentPage = <FullPage />;
  }

  return currentPage;
}

export default App;
