import Dialog from "../components/Dialog";
import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import { Locale, useTranslation } from "../lang/translate";
import styles from "./SettingsDialog.module.css";

export default function SettingsDialog(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const { t, currentLocale, setCurrentLocale } = useTranslation();

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
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("settings.title")}
    >
      <div class={styles.content}>
        <SelectBox
          label={t("settings.language")}
          selected={currentLocale()}
          possibleValues={languageEntries}
          onSelect={(value) => setCurrentLocale(value as Locale)}
        />
      </div>
    </Dialog>
  );
}
