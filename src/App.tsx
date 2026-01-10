import { createSignal } from "solid-js";
import styles from "./App.module.css";
import EmployeeEditDialog from "./employee/EmployeeEditDialog";

export default function App() {
  const [showEmployeeEditDialog, setShowEmployeeEditDialog] =
    createSignal(true);

  return (
    <main>
      <EmployeeEditDialog
        show={showEmployeeEditDialog()}
        setShow={setShowEmployeeEditDialog}
      />
    </main>
  );
}
