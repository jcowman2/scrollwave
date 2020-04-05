import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import EditPage from "./pages/edit/EditPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/edit">
          <EditPage />
        </Route>
        <Route path="/read">Read</Route>
        <Route path="/">Home</Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
