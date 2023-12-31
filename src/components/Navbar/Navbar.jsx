// Navbar.jsx

import React, { useState } from "react";
import "./Navbar.css";
import "../../../bootstrap.css";

export default function Navbar(props) {
  const [selectedSortOrder, setSelectedSortOrder] = useState(props.sortOrder);

  const applySortOrder = () => {
    props.handleSortChange({ target: { value: selectedSortOrder } });
  };

  return (
    <div className={`navbar ${props.theme === "dark" ? "dark" : ""}`}>
      <h2>intelliTask Kanban</h2>
      <div className="dropdown">
        <label htmlFor="sortOrder">Sort Order:</label>
        <select
          id="sortOrder"
          onChange={(e) => setSelectedSortOrder(e.target.value)}
          value={selectedSortOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={applySortOrder}>Apply</button>
      </div>

      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          style={{ transition: "all 200ms" }}
          onChange={props.switchTheme}
        />
        <label htmlFor="checkbox" className="label">
          <div className="ball" />
        </label>
      </div>
    </div>
  );
}
