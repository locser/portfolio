"use client";

import i18n from "i18next";
import { ThemeProvider } from "next-themes";
import { I18nextProvider , initReactI18next } from "react-i18next";

import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
    // vi: { translation: viTra}
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}