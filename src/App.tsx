import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import EditPage from "./pages/edit/EditPage";
import FullPage from "./common/FullPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/edit">
          <FullPage>
            <EditPage />
          </FullPage>
        </Route>
        <Route path="/read">Read</Route>
        <Route path="/">Home</Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
