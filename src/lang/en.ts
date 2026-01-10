import * as i18n from "@solid-primitives/i18n";

export const dict = {
  general: {
    searchPlaceholder: "Search...",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
  },
  employee: {
    title: "Employee management",
    create: "Create employee",
    idHint: i18n.template<{ id: number }>("Employee ID: {{ id }}"),
    name: "Name",
  },
  settings: {
    title: "Settings",
    language: "Language"
  },
};
