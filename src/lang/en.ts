import * as i18n from "@solid-primitives/i18n";

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
    responsible_employee: "Responsible employee",
  },
  settings: {
    title: "Settings",
    language: "Language",
  },
};
