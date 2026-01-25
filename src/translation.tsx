import * as i18n from "@solid-primitives/i18n";

import * as en from "./lang/en.ts";
import * as de from "./lang/de.ts";
import { createContext, createMemo, JSX, useContext } from "solid-js";
import { appConfig } from "./appConfig.ts";

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
export type Translation = {
  t: i18n.Translator<typeof dict>;
};

export const TranslationContext = createContext<Translation>();

export function TranslationContextProvider(props: { children: JSX.Element }) {
  const language = () => appConfig("general.language");

  const dict = createMemo(() => i18n.flatten(locales[language()].dict));
  const t = i18n.translator(dict, i18n.resolveTemplate);

  return (
    <TranslationContext.Provider value={{ t }}>
      {props.children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): Translation {
  return useContext(TranslationContext)!!;
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
