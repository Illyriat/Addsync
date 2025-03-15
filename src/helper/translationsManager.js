import translations from "./translations";

class TranslationManager {
  constructor() {
    this.currentLanguage = "en";
    this.loadSavedLanguage();
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem("language", lang);
      window.dispatchEvent(new Event("languageChanged"));
    } else {
      console.error(`Language '${lang}' not found in translations.`);
    }
  }

  getTranslation(key, category = null) {
    if (category) {
      return translations[this.currentLanguage]?.[category]?.[key] || `[${key}]`; 
    }
    return translations[this.currentLanguage]?.[key] || `[${key}]`;
  }

  getGameTranslation(game, key) {
    return translations[this.currentLanguage]?.games?.[game]?.[key] || `[${key}]`;
  }

  loadSavedLanguage() {
    const savedLang = localStorage.getItem("language");
    if (savedLang && translations[savedLang]) {
      this.currentLanguage = savedLang;
    }
  }
}

const translationManager = new TranslationManager();
export default translationManager;
