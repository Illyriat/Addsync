import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./NavBar.css"; // Import the CSS

const NavBar = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  let hoverTimeout; // Timeout reference

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout); // Prevent closing on quick hover
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setMenuOpen(false);
    }, 200); // Short delay to prevent instant collapse
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <h1>Addsync</h1>
      </Link>

      <div className="nav-controls">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Wrap button + dropdown in a single hover container */}
        <div 
          className="hamburger-container" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <button className="hamburger">☰</button>
          {menuOpen && (
            <div className="dropdown-menu">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/eso" onClick={() => setMenuOpen(false)}>The Elder Scrolls Online</NavLink>
              <NavLink to="/wow" onClick={() => setMenuOpen(false)}>World of Warcraft</NavLink>
              <NavLink to="/ffxiv" onClick={() => setMenuOpen(false)}>Final Fantasy XIV</NavLink>
              <NavLink to="/gw2" onClick={() => setMenuOpen(false)}>Guild Wars 2</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
