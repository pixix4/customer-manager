import Dialog from "../components/Dialog";
import { usePreferences } from "../preferences";
import styles from "./SettingsDialog.module.css";
import PreferencesPanel from "./PreferencesPanel";
import VersionPanel from "./VersionPanel";

export default function SettingsDialog(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const { t } = usePreferences();

  return (
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("settings.title")}
    >
      <div class={styles.content}>
        <PreferencesPanel />
        <VersionPanel />
      </div>
    </Dialog>
  );
}
