import * as i18n from "@solid-primitives/i18n";
import { RawDictionary } from "../preferences";

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
    responsibleEmployee: "Zuständiger Mitarbeiter",
    appointment: {
      title: "Termine",
      dialogTitle: "Terminverwaltung",
      create: "Termin erstellen",
      idHint: i18n.template<{ id: number }>("Termin-ID: {{ id }}"),
      number: "Nr.",
      startDateTime: "Termin am",
      startDate: "Startdatum",
      startTime: "Startuhrzeit",
      duration: "Dauer",
      endTime: "Ende",
      period: "Zeitraum",
      treatment: "Behandlung",
      price: "Preis",
      employee: "Mitarbeiter",
    },
  },
  settings: {
    title: "Einstellungen",
    language: "Sprache",
    fontSize: "Schriftgröße",
    openAppDataDirectory: "App-Ordner öffnen",
  },
};
