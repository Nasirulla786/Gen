import React from "react";
import Route from "./services/RouteApp";
import useCurrentUser from "./hooks/useCurrentUser";


export const ServerURL = "http://localhost:3000";

const App = () => {
  useCurrentUser();
  return (
    <div>
      <Route />
    </div>
  );
};

export default App;
