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
    dialogTitle: "Mitarbeiterverwaltung",
    create: "Mitarbeiter erstellen",
    idHint: i18n.template<{ id: number }>("Mitarbeiter-ID: {{ id }}"),
    name: "Name",
  },
  customer: {
    create: "Kunde erstellen",
    idHint: i18n.template<{ id: number }>("Kunden-ID: {{ id }}"),
    title: "Anrede",
    firstName: "Vorname",
    lastName: "Nachname",
    addressStreet: "Straße",
    addressCity: "Ort",
    phone: "Telefon",
    mobilePhone: "Mobil",
    birthdate: "Geburtstag",
    customerSince: "Kunde seit",
    note: "Notiz",
    responsible_employee: "Zuständiger Mitarbeiter",
  },
  settings: {
    title: "Einstellungen",
    language: "Sprache",
  },
};
