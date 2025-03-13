import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "./components/navigation/NavBar";

import Home from "./pages/Home";
import ElderScrollsOnline from "./pages/games/ElderScrollsOnline";
import WorldOfWarcraft from "./pages/games/WorldOfWarcraft";
import FinalFantasyXIV from "./pages/games/FinalFantasyXIV";
import GuildWars2 from "./pages/games/GuildWars2";

import "./styles/styles.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Router>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eso" element={<ElderScrollsOnline />} />
            <Route path="/wow" element={<WorldOfWarcraft />} />
            <Route path="/ffxiv" element={<FinalFantasyXIV />} />
            <Route path="/gw2" element={<GuildWars2/>} /> 
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
