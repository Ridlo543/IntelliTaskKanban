// components/Navbar/Navbar.jsx
import React, { useState } from "react";
import "../styles/Navbar.css";
import "../styles/bootstrap.css";

export default function Navbar(props) {
  const [selectedGreedyOption, setSelectedGreedyOption] = useState("Weight");

  const handleGreedyOptionChange = (event) => {
    setSelectedGreedyOption(event.target.value);
  };

  const handleApplyGreedyAlgorithm = () => {
    props.applyGreedyAlgorithm(selectedGreedyOption);
  };

  const [manualCapacity, setManualCapacity] = useState(""); // State untuk input manual

  const handleManualCapacityChange = (event) => {
    setManualCapacity(event.target.value);
  };

  const handleApplyManualCapacity = () => {
    const parsedCapacity = parseInt(manualCapacity, 10);

    if (!isNaN(parsedCapacity)) {
      // Pastikan kapasitas yang dimasukkan adalah angka
      props.applyGreedyAlgorithm("Weight", parsedCapacity); // Ganti 'Weight' sesuai kebutuhan
    } else {
      alert("Invalid capacity input. Please enter a valid number.");
    }
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
      <div>
        <label>Kapasitas Jam:</label>
        <input
          type="text"
          value={manualCapacity}
          onChange={handleManualCapacityChange}
        />
        <button onClick={handleApplyManualCapacity}>Apply</button>
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
