import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import translationManager from "../../helper/translationsManager";
import languageOptions from "../../helper/translations/languageOptions";
import "./NavBar.css";

const NavBar = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(translationManager.currentLanguage);
  let hoverTimeout = null;

  useEffect(() => {
    const updateLanguage = () => setCurrentLang(translationManager.currentLanguage);
    window.addEventListener("languageChanged", updateLanguage);
    
    return () => window.removeEventListener("languageChanged", updateLanguage);
  }, []);

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  const changeLanguage = (lang) => {
    translationManager.setLanguage(lang);
    setCurrentLang(lang);
    setLangDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <h1>Addsync</h1>
      </Link>

      <div className="nav-controls">
        {/* Language Dropdown */}
        <div className="language-dropdown">
          <button className="language-button" onClick={toggleLangDropdown}>
            <img 
              src={languageOptions[currentLang].flag} 
              alt={languageOptions[currentLang].label} 
              className="language-flag" 
            />
          </button>
          {langDropdownOpen && (
            <div className="language-menu">
              {Object.keys(languageOptions).map((lang) => (
                <button key={lang} onClick={() => changeLanguage(lang)} className={currentLang === lang ? "active-lang" : ""}>
                  <img 
                    src={languageOptions[lang].flag} 
                    alt={languageOptions[lang].label} 
                    className="dropdown-flag" 
                  />
                  <span className="language-name">{languageOptions[lang].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? translationManager.getTranslation("lightMode") : translationManager.getTranslation("darkMode")}
        </button>

        <div 
          className="hamburger-container"
          onMouseEnter={() => {
            clearTimeout(hoverTimeout);
            setMenuOpen(true);
          }}
          onMouseLeave={() => {
            hoverTimeout = setTimeout(() => {
              setMenuOpen(false);
            }, 200);
          }}
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
