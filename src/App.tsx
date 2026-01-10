import { createSignal } from "solid-js";
import styles from "./App.module.css";
import EmployeeEditDialog from "./employee/EmployeeEditDialog";
import {
  RiSystemSettings4Fill,
  RiUserFacesAccountCircleFill,
} from "solid-icons/ri";
import { useTranslation } from "./lang/translate";
import SettingsDialog from "./settings/SettingsDialog";

export default function App() {
  const { t } = useTranslation();

  const [showEmployeeEditDialog, setShowEmployeeEditDialog] =
    createSignal(false);
  const [showSettingsDialog, setShowSettingsDialog] = createSignal(false);

  return (
    <>
      <div class={styles.app}>
        <header data-tauri-drag-region class={styles.titleBar}>
          <div class={styles.titleBarActions}>
            <button
              class={styles.titleBarButton}
              onClick={() => setShowEmployeeEditDialog((x) => !x)}
              title={t("employee.title")}
            >
              <RiUserFacesAccountCircleFill />
            </button>
            <button
              class={styles.titleBarButton}
              onClick={() => setShowSettingsDialog((x) => !x)}
              title={t("settings.title")}
            >
              <RiSystemSettings4Fill />
            </button>
          </div>
        </header>
        <main class={styles.content}>Content</main>
      </div>

      <EmployeeEditDialog
        show={showEmployeeEditDialog()}
        setShow={setShowEmployeeEditDialog}
      />
      <SettingsDialog
        show={showSettingsDialog()}
        setShow={setShowSettingsDialog}
      />
    </>
  );
}
