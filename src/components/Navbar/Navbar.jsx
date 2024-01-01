// components/Navbar/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";
import "../../../bootstrap.css";

export default function Navbar(props) {
  const [selectedGreedyOption, setSelectedGreedyOption] = useState("Weight");

  const handleGreedyOptionChange = (event) => {
    setSelectedGreedyOption(event.target.value);
  };

  const handleApplyGreedyAlgorithm = () => {
    props.applyGreedyAlgorithm(selectedGreedyOption);
  };

  return (
    <div className={`navbar ${props.theme === "dark" ? "dark" : ""}`}>
      <h2>intelliTask Kanban</h2>
      <div className="filter-dropdown">
        <select onChange={handleGreedyOptionChange}>
          <option value="Weight">Greedy (Weight)</option>
          <option value="Profit">Greedy (Profit)</option>
          <option value="Density">Greedy (Density)</option>
        </select>
        <button onClick={handleApplyGreedyAlgorithm}>Apply</button>
      </div>

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
  );
}
