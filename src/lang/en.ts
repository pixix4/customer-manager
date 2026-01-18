import * as i18n from "@solid-primitives/i18n";
import { openAppDataDirectory } from "../model";

export const dict = {
  general: {
    searchPlaceholder: "Search...",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
  },
  employee: {
    dialogTitle: "Employee management",
    create: "Create employee",
    idHint: i18n.template<{ id: number }>("Employee ID: {{ id }}"),
    name: "Name",
  },
  customer: {
    create: "Create customer",
    idHint: i18n.template<{ id: number }>("Customer ID: {{ id }}"),
    title: "Title",
    firstName: "First name",
    lastName: "Last name",
    addressStreet: "Street",
    addressCity: "City",
    phone: "Phone",
    mobilePhone: "Mobile phone",
    birthdate: "Birthdate",
    customerSince: "Customer since",
    note: "Note",
    responsibleEmployee: "Responsible employee",
    appointment: {
      dialogTitle: "Appointment management",
      create: "Create appointment",
      idHint: i18n.template<{ id: number }>("Appointment ID: {{ id }}"),
      number: "Nr.",
      startDateTime: "Appointment at",
      startDate: "Start date",
      startTime: "Start time",
      duration: "Duration",
      endTime: "End",
      period: "Period",
      treatment: "Treatment",
      employee: "Employee",
    },
  },
  settings: {
    title: "Settings",
    language: "Language",
    fontSize: "Font size",
    openAppDataDirectory: "Open app data directory",
  },
};
