import { createEffect, createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
import styles from "./EmployeeDetails.module.css";
import Button from "../components/Button";
import {
  createEmployeeByIdResource,
  deleteEmployee,
  EditEmployeeDto,
  storeEmployee,
} from "../model";
import { useTranslation } from "../translation";

const emptyEditData: EditEmployeeDto = {
  id: null,
  name: "",
};

function areEqual(a: EditEmployeeDto, b: EditEmployeeDto): boolean {
  if (a.name !== b.name) return false;

  return true;
}

export default function EmployeeDetails(props: {
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  const [employee] = createEmployeeByIdResource(() => props.selectedId);

  const [editData, setEditData] = createSignal<EditEmployeeDto>({
    ...emptyEditData,
  });
  const [baseData, setBaseData] = createSignal<EditEmployeeDto>({
    ...emptyEditData,
  });

  const hasChanges = () => !areEqual(editData(), baseData());

  createEffect(async () => {
    if (props.selectedId === null || props.selectedId === undefined) {
      const obj = { ...emptyEditData };

      setEditData(obj);
      setBaseData(obj);

      return;
    }

    if (employee.loading || employee.error) {
      return;
    }

    const data = employee();
    if (data) {
      const obj = {
        id: data.id,
        name: data.name,
      };

      setEditData(obj);
      setBaseData(obj);
    } else {
      const obj = { ...emptyEditData };

      setEditData(obj);
      setBaseData(obj);
    }
  });
  const handleChange = <K extends keyof EditEmployeeDto>(
    key: K,
    value: EditEmployeeDto[K],
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

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
    <div class={styles.employeeDetails}>
      <TextInput
        label={t("employee.name")}
        value={editData().name}
        onChange={(v) => handleChange("name", v)}
      />

      <div class={styles.actionRow}>
        <Button color="danger" onClick={deleteData}>
          {t("general.delete")}
        </Button>
        <Show when={props.selectedId !== null}>
          <div class={styles.idHint}>
            {t("employee.idHint", { id: props.selectedId ?? -1 })}
          </div>
        </Show>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData} disabled={!hasChanges()}>
          {t("general.save")}
        </Button>
      </div>
    </div>
  );
}
