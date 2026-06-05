import React from "react";
import Route from "./services/RouteApp";
import useCurrentUser from "./hooks/useCurrentUser";

export const ServerURL = "https://gen-1-backend.onrender.com";

const App = () => {
  useCurrentUser();
  return (
    <div>
      <Route />
    </div>
  );
};

export default App;
