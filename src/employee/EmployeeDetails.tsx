import { createEffect, createSignal } from "solid-js";
import TextInput from "../components/TextInput";
import styles from "./EmployeeDetails.module.css";
import Button from "../components/Button";
import {
  createEmployeeByIdResource,
  deleteEmployee,
  EditEmployeeDto,
  storeEmployee,
} from "../model";

const emptyEditData: EditEmployeeDto = {
  id: null,
  name: "",
};

export default function EmployeeDetails(props: {
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const [employee] = createEmployeeByIdResource(() => props.selectedId);

  const [editData, setEditData] = createSignal<EditEmployeeDto>(emptyEditData);
  const handleChange = <K extends keyof EditEmployeeDto>(
    key: K,
    value: EditEmployeeDto[K]
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  createEffect(async () => {
    if (employee.loading || employee.error) {
      return;
    }

    const data = employee();
    if (data) {
      setEditData({
        id: data.id,
        name: data.name,
      });
    } else {
      setEditData({ ...emptyEditData });
    }
  });

  const storeData = async () => {
    const id = await storeEmployee(editData());
    props.onUpdate();
    props.setSelectedId(id);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteEmployee(props.selectedId);
    props.onUpdate();
    props.setSelectedId(undefined);
  };

  return (
    <div class={styles.tagDetails}>
      <TextInput
        label="Name"
        value={editData().name}
        onChange={(v) => handleChange("name", v)}
      />

      <div class={styles.actionRow}>
        <Button color="danger" onClick={deleteData}>
          Löschen
        </Button>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          Abbrechen
        </Button>
        <Button color="primary" onClick={storeData}>
          Speichern
        </Button>
      </div>
      <div style="opacity: 0.5; margin-top: 0.6em">
        Mitarbeiter ID: {props.selectedId ?? "null"}
      </div>
    </div>
  );
}
