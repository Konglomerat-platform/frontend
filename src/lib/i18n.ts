import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      brand: "Konglomerat",
      about: "Biz haqimizda",
      showrooms: "Shourumlar",
      favorites: "Sevimlilar",
      news: "Yangiliklar",
      assistant: "AI-assistent",
      complaint: "Shikoyat",
      login: "Kirish",
      logout: "Chiqish",
      heroTitle: "Milliy Konglomerat AI boshqaruvida",
      heroLead: "30 kompaniyani yagona raqamli boshqaruv ostida birlashtiruvchi platforma.",
      buy: "Sotib olish",
      send: "Yuborish",
      save: "Saqlash",
      admin: "Direktor paneli",
      company: "Kompaniya kabineti",
    },
  },
  ru: {
    translation: {
      brand: "Konglomerat",
      about: "О нас",
      showrooms: "Шоурумы",
      favorites: "Избранное",
      news: "Новости",
      assistant: "AI-ассистент",
      complaint: "Жалоба",
      login: "Войти",
      logout: "Выйти",
      heroTitle: "Национальный Konglomerat под управлением ИИ",
      heroLead: "Единая цифровая платформа, объединяющая 30 компаний под управлением Директора.",
      buy: "Купить",
      send: "Отправить",
      save: "Сохранить",
      admin: "Панель Директора",
      company: "Кабинет компании",
    },
  },
  en: {
    translation: {
      brand: "Konglomerat",
      about: "About",
      showrooms: "Showrooms",
      favorites: "Favorites",
      news: "News",
      assistant: "AI assistant",
      complaint: "Complaint",
      login: "Log in",
      logout: "Log out",
      heroTitle: "National AI-managed Konglomerat",
      heroLead: "A single digital platform uniting 30 companies under Director control.",
      buy: "Buy",
      send: "Send",
      save: "Save",
      admin: "Director Panel",
      company: "Company Cabinet",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("kong_lang") || "ru",
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

export default i18n;
