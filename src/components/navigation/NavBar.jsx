import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import translationManager from "../../helper/translationsManager";
import "./NavBar.css";

const NavBar = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(translationManager.currentLanguage);
  let hoverTimeout = null;

  useEffect(() => {
    const updateLanguage = () => setCurrentLang(translationManager.currentLanguage);
    window.addEventListener("languageChanged", updateLanguage);
    
    return () => window.removeEventListener("languageChanged", updateLanguage);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setMenuOpen(false);
    }, 200);
  };

  const changeLanguage = (lang) => {
    translationManager.setLanguage(lang);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <h1>Addsync</h1>
      </Link>

      <div className="nav-controls">

      <div className="language-selector">
          {["en", "de", "fr", "ru"].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={currentLang === lang ? "active-lang" : ""}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? translationManager.getTranslation("lightMode") : translationManager.getTranslation("darkMode")}
        </button>

        <div 
          className="hamburger-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="hamburger">☰</button>
          {menuOpen && (
            <div className="dropdown-menu">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                {translationManager.getTranslation("home")}
              </NavLink>
              <NavLink to="/eso" onClick={() => setMenuOpen(false)}>
                {translationManager.getTranslation("eso")}
              </NavLink>
              <NavLink to="/wow" onClick={() => setMenuOpen(false)}>
                {translationManager.getTranslation("wow")}
              </NavLink>
              <NavLink to="/ffxiv" onClick={() => setMenuOpen(false)}>
                {translationManager.getTranslation("ffxiv")}
              </NavLink>
              <NavLink to="/gw2" onClick={() => setMenuOpen(false)}>
                {translationManager.getTranslation("gw2")}
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;