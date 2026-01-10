import * as i18n from "@solid-primitives/i18n";

import * as en from "./en.ts";
import * as de from "./de.ts";
import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
  JSX,
  Setter,
  useContext,
} from "solid-js";

export type Locale = "en" | "de";
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;
const locales = { en, de };

const dict = i18n.flatten(en.dict);
export type Translator = {
  t: i18n.Translator<typeof dict>;
  currentLocale: Accessor<Locale>;
  setCurrentLocale: Setter<Locale>;
};

export const TranslatorContext = createContext<Translator>();

export function TranslatorContextProvider(props: { children: JSX.Element }) {
  const [locale, setLocale] = createSignal<Locale>("en");
  const dict = createMemo(() => i18n.flatten(locales[locale()].dict));
  const t = i18n.translator(dict, i18n.resolveTemplate);

  return (
    <TranslatorContext.Provider
      value={{ t, currentLocale: locale, setCurrentLocale: setLocale }}
    >
      {props.children}
    </TranslatorContext.Provider>
  );
}

export function useTranslation(): Translator {
  return useContext(TranslatorContext)!!;
}
