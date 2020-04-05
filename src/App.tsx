import React from "react";

import EditPage from "./pages/edit/EditPage";
import { Route } from "./common/enum";
import FullPage from "./common/FullPage";
import ViewPage from "./pages/view/ViewPage";

function App() {
  const [route, setRoute] = React.useState(Route.EDIT);

  let currentPage;
  switch (route) {
    case Route.EDIT:
      currentPage = <EditPage onWatch={() => setRoute(Route.VIEW)} />;
      break;
    case Route.VIEW:
      currentPage = <ViewPage />;
      break;
    default:
      currentPage = <FullPage />;
  }

  return currentPage;
}

export default App;
