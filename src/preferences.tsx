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

export type WeekDayArray = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
export type MonthArray = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

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

export function getTranslatedWeekDaysShortArray(
  t: i18n.Translator<typeof dict>,
): WeekDayArray {
  return [
    t("calendar.weekDays.sunday.short"),
    t("calendar.weekDays.monday.short"),
    t("calendar.weekDays.tuesday.short"),
    t("calendar.weekDays.wednesday.short"),
    t("calendar.weekDays.thursday.short"),
    t("calendar.weekDays.friday.short"),
    t("calendar.weekDays.saturday.short"),
  ];
}

export function getTranslatedMonthLongArray(
  t: i18n.Translator<typeof dict>,
): MonthArray {
  return [
    t("calendar.months.january.long"),
    t("calendar.months.february.long"),
    t("calendar.months.march.long"),
    t("calendar.months.april.long"),
    t("calendar.months.may.long"),
    t("calendar.months.june.long"),
    t("calendar.months.july.long"),
    t("calendar.months.august.long"),
    t("calendar.months.september.long"),
    t("calendar.months.october.long"),
    t("calendar.months.november.long"),
    t("calendar.months.december.long"),
  ];
}
