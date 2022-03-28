import React from "react";
import { NavLink } from "react-router-dom";

function Presentation() {
  return (
    <div className="App-presentation pt-4">
      <div className="text-center logo-holder">
        <i className="fas fa-tasks" />
      </div>
      {true ? null : (
        <NavLink to="/auth" className="do do-primary">
          <i className="fas fa-plug" />
          <span>Access here to post</span>
        </NavLink>
      )}
    </div>
  );
}

export default Presentation;
