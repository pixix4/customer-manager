import { createStore } from "solid-js/store";
import { getPreferenceList, storePreference } from "./model";

export type Locale = "en" | "de";

export type AppConfig = {
  "general.font-size": number;
  "general.language": Locale;
};

const defaultAppConfig: AppConfig = {
  "general.font-size": 14,
  "general.language": "en",
};

const [appConfigRaw, setAppConfigRaw] = createStore<AppConfig>(null!);

(async () => {
  const preferences = await getPreferenceList();

  for (const key in defaultAppConfig) {
    const value = preferences.find((v) => v.key === key);
    if (value) {
      setAppConfigRaw(key as keyof AppConfig, JSON.parse(value.value));
    }
  }
})();

export function setAppConfig<K extends keyof AppConfig>(
  key: K,
  value: AppConfig[K],
): void {
  if (defaultAppConfig[key] === value) {
    storePreference({
      key,
      value: null,
    });

    setAppConfigRaw(key, undefined!);
  } else {
    storePreference({
      key,
      value: JSON.stringify(value),
    });

    setAppConfigRaw(key, value);
  }
}

export function appConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  const value = appConfigRaw[key];
  return value ?? defaultAppConfig[key];
}
