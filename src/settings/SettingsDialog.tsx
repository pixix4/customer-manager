import { createEffect } from "solid-js";
import Dialog from "../components/Dialog";
import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import SimpleInput from "../components/SimpleInput";
import { Locale, usePreferences } from "../preferences";
import styles from "./SettingsDialog.module.css";
import Button from "../components/Button";
import { openAppDataDirectory } from "../model";

export default function SettingsDialog(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
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

  createEffect(() => {
    document.documentElement.style.setProperty(
      "--font-size",
      `${fontSize()}px`,
    );
  });

  return (
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("settings.title")}
    >
      <div class={styles.content}>
        <SelectBox
          label={t("settings.language")}
          selected={language()}
          possibleValues={languageEntries}
          onSelect={(value) => setLanguage(value as Locale)}
        />

        <SimpleInput
          label={t("settings.fontSize")}
          type="number"
          value={fontSize().toString()}
          onChange={(v) => setFontSize(parseInt(v))}
        />

        <Button onClick={openAppDataDirectory}>
          {t("settings.openAppDataDirectory")}
        </Button>
      </div>
    </Dialog>
  );
}
