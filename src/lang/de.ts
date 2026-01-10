import * as i18n from "@solid-primitives/i18n";
import { RawDictionary } from "./translate";

export const dict: RawDictionary = {
  general: {
    searchPlaceholder: "Suche...",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
  },
  employee: {
    title: "Mitarbeiterverwaltung",
    create: "Mitarbeiter erstellen",
    idHint: i18n.template<{ id: number }>("Mitarbeiter ID: {{ id }}"),
    name: "Name",
  },
  settings: {
    title: "Einstellungen",
    language: "Sprache",
  },
};
