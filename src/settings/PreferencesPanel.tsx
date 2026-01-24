import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import { Locale, usePreferences } from "../preferences";
import Button from "../components/Button";
import { openAppDataDirectory } from "../model";
import NumberInput from "../components/input/NumberInput";

export default function PreferencesPanel() {
  const { t, language, setLanguage, fontSize, setFontSize } = usePreferences();

  const languageEntries: SelectBoxPossibleValue[] = [
    {
      id: "en",
      name: "English",
    },
    {
      id: "de",
      name: "Deutsch",
    },
  ];

  return (
    <div>
      <SelectBox
        label={t("settings.language")}
        selected={language()}
        possibleValues={languageEntries}
        onSelect={(value) => setLanguage(value as Locale)}
      />

      <NumberInput
        label={t("settings.fontSize")}
        value={fontSize()}
        onChange={setFontSize}
        min={4}
        max={64}
      />

      <Button onClick={openAppDataDirectory}>
        {t("settings.openAppDataDirectory")}
      </Button>
    </div>
  );
}
