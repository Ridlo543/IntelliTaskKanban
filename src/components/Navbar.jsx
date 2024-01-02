// components/Navbar/Navbar.jsx
import React, { useState } from "react";
import "../styles/Navbar.css";
import "../styles/bootstrap.css";

export default function Navbar(props) {
  const [algorithmForm, setAlgorithmForm] = useState({
    greedyOption: "Weight",
    manualCapacity: "",
  });

  const handleAlgorithmFormChange = (event) => {
    const { name, value } = event.target;
    setAlgorithmForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyAlgorithm = () => {
    const parsedCapacity = parseInt(algorithmForm.manualCapacity, 10);

    if (!isNaN(parsedCapacity)) {
      props.applyGreedyAlgorithm(algorithmForm.greedyOption, parsedCapacity);
    } else {
      props.applyGreedyAlgorithm(algorithmForm.greedyOption);
    }
  };

  const handleManualCapacityChange = (event) => {
    setAlgorithmForm((prev) => ({
      ...prev,
      manualCapacity: event.target.value,
    }));
  };

  return (
    <div className={`navbar ${props.theme === "dark" ? "dark" : ""}`}>
      <h2>intelliTask Kanban</h2>
      <div className="filter-dropdown">
        <label>Algoritma:</label>
        <select
          name="greedyOption"
          value={algorithmForm.greedyOption}
          onChange={handleAlgorithmFormChange}
        >
          <option value="Weight">Greedy (Weight)</option>
          <option value="Profit">Greedy (Profit)</option>
          <option value="Density">Greedy (Density)</option>
        </select>
        
        <label>Kapasitas Jam:</label>
        <input
          type="text"
          name="manualCapacity"
          value={algorithmForm.manualCapacity}
          onChange={handleManualCapacityChange}
        />
      <button onClick={handleApplyAlgorithm}>Apply</button>
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
