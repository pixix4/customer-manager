import { createSignal } from "solid-js";
import styles from "./App.module.css";
import EmployeeEditDialog from "./employee/EmployeeEditDialog";
import { RiUserFacesAccountCircleLine } from "solid-icons/ri";

export default function App() {
  const [showEmployeeEditDialog, setShowEmployeeEditDialog] =
    createSignal(false);

  return (
    <>
      <div class={styles.app}>
        <header data-tauri-drag-region class={styles.titleBar}>
          <div class={styles.titleBarActions}>
            <button
              class={styles.titleBarButton}
              onClick={() => setShowEmployeeEditDialog((x) => !x)}
            >
              <RiUserFacesAccountCircleLine />
            </button>
          </div>
        </header>
        <main class={styles.content}>Content</main>
      </div>

      <EmployeeEditDialog
        show={showEmployeeEditDialog()}
        setShow={setShowEmployeeEditDialog}
      />
    </>
  );
}
