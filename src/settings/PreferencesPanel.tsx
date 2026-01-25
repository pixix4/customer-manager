import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import { useTranslation } from "../translation";
import Button from "../components/Button";
import { openAppDataDirectory } from "../model";
import NumberInput from "../components/input/NumberInput";
import { appConfig, Locale, setAppConfig } from "../appConfig";

export default function PreferencesPanel() {
  const { t } = useTranslation();

  const language = () => appConfig("general.language");
  const fontSize = () => appConfig("general.font-size");

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
        onSelect={(value) => setAppConfig("general.language", value as Locale)}
      />

      <NumberInput
        label={t("settings.fontSize")}
        value={fontSize()}
        onChange={(v) => setAppConfig("general.font-size", v)}
        min={4}
        max={64}
      />

      <Button onClick={openAppDataDirectory}>
        {t("settings.openAppDataDirectory")}
      </Button>
    </div>
  );
}
