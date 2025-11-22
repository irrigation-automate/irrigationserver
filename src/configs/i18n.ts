import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

// Ensure the fs-backend uses an absolute path based on this file's directory.
const localesPath = path.join(__dirname, "../locales/{{lng}}/{{ns}}.json");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init(
    {
      fallbackLng: "en",
      preload: ["en", "fr", "ar"],
      ns: ["auth", "health"],
      defaultNS: "auth",
      backend: {
        loadPath: localesPath,
      },
      detection: {
        order: ["header", "querystring", "cookie"],
        caches: false,
      },
      debug: process.env.NODE_ENV !== "production",
    },
    (err) => console.error("i18next init error:", err),
  );

export default i18next;

export const I18NEXT = middleware.handle(i18next);
