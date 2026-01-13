import * as i18n from "@solid-primitives/i18n";

import * as en from "./lang/en.ts";
import * as de from "./lang/de.ts";
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  Setter,
  useContext,
} from "solid-js";
import { getPreferenceList, storePreference } from "./model.ts";

export type Locale = "en" | "de";
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;
const locales = { en, de };

const dict = i18n.flatten(en.dict);
export type Preferences = {
  t: i18n.Translator<typeof dict>;
  language: Accessor<Locale>;
  setLanguage: Setter<Locale>;
  fontSize: Accessor<number>;
  setFontSize: Setter<number>;
};

export const PreferencesContext = createContext<Preferences>();

export function PreferencesContextProvider(props: { children: JSX.Element }) {
  const [language, setLanguage] = createSignal<Locale>("en");
  const [fontSize, setFontSize] = createSignal(16);

  const dict = createMemo(() => i18n.flatten(locales[language()].dict));
  const t = i18n.translator(dict, i18n.resolveTemplate);

  createEffect(() => {
    storePreference({
      key: "language",
      value: language(),
    });
  });
  createEffect(() => {
    storePreference({
      key: "fontSize",
      value: fontSize().toString(),
    });
  });

  (async () => {
    const preferences = await getPreferenceList();
    for (let preference of preferences) {
      switch (preference.key) {
        case "language":
          setLanguage(preference.value as Locale);
          break;
        case "fontSize":
          setFontSize(parseInt(preference.value));
          break;
      }
    }
  })();

  return (
    <PreferencesContext.Provider
      value={{ t, language, setLanguage, fontSize, setFontSize }}
    >
      {props.children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  return useContext(PreferencesContext)!!;
}

export function useTranslation(): i18n.Translator<typeof dict> {
  return useContext(PreferencesContext)!!.t;
}
