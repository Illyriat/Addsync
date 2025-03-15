import { useState, useEffect } from "react";
import translationManager from "../helper/translationsManager";

const Home = () => {
  const [_, setRerender] = useState(0);

  useEffect(() => {
    const updateLanguage = () => setRerender(prev => prev + 1);
    window.addEventListener("languageChanged", updateLanguage);
    return () => window.removeEventListener("languageChanged", updateLanguage);
  }, []);

  return (
    <div>
      <h3 className="text-3xl font-bold">{translationManager.getTranslation("welcome")}</h3>
      <p className="mt-4">{translationManager.getTranslation("description")}</p>
    </div>
  );
};

export default Home;
