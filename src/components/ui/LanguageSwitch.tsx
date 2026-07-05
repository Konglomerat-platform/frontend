import { useTranslation } from "react-i18next";

import { languages } from "../../lib/format";

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {languages.map((lang) => (
        <button
          key={lang}
          type="button"
          className={i18n.language === lang ? "active" : ""}
          onClick={() => {
            localStorage.setItem("kong_lang", lang);
            i18n.changeLanguage(lang);
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
