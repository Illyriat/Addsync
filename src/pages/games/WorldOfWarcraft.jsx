import { useState, useEffect } from "react";
import translationManager from "../../helper/translationsManager";

const WorldOfWarcraft = () => {
  const [_, setRerender] = useState(0);

  useEffect(() => {
    const updateLanguage = () => setRerender(prev => prev + 1);
    window.addEventListener("languageChanged", updateLanguage);
    return () => window.removeEventListener("languageChanged", updateLanguage);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">{translationManager.getGameTranslation("wow", "title")}</h1>
      <p className="mt-4">{translationManager.getGameTranslation("wow", "description")}</p>
    </div>
  );
};

export default WorldOfWarcraft;