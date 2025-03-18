import { useState, useEffect } from "react";
import translationManager from "../../helper/translationsManager";
import FolderSelector from "../../components/folderSelector/FolderSelector";
import "./GamePage.css";

const GamePage = ({ gameKey, darkMode }) => {
  const [_, setRerender] = useState(0);
  const [hasFolder, setHasFolder] = useState(false); // Track folder selection

  useEffect(() => {
    const updateLanguage = () => setRerender(prev => prev + 1);
    window.addEventListener("languageChanged", updateLanguage);
    return () => window.removeEventListener("languageChanged", updateLanguage);
  }, []);

  return (
    <div className={`game-container ${hasFolder ? "has-folder" : ""}`}>
      <div className="game-card">
        <h1 className="game-title">
          {translationManager.getGameTranslation(gameKey, "title")}
        </h1>
        <p className="game-description">
          {translationManager.getGameTranslation(gameKey, "description")}
        </p>
        <div className="game-folder-container">
          <FolderSelector gameKey={gameKey} setHasFolder={setHasFolder} />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
