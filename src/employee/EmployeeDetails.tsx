import { createEffect, createSignal, Show } from "solid-js";
import TextInput from "../components/TextInput";
import styles from "./EmployeeDetails.module.css";
import Button from "../components/Button";
import {
  createEmployeeByIdResource,
  deleteEmployee,
  EditEmployeeDto,
  storeEmployee,
} from "../model";
import { useTranslation } from "../lang/translate";

const emptyEditData: EditEmployeeDto = {
  id: null,
  name: "",
};

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
  const handleChange = <K extends keyof EditEmployeeDto>(
    key: K,
    value: EditEmployeeDto[K]
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  createEffect(async () => {
    if (props.selectedId === null || props.selectedId === undefined) {
      setEditData({ ...emptyEditData });
      return;
    }

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
        <Button color="primary" onClick={storeData}>
          {t("general.save")}
        </Button>
      </div>
    </div>
  );
}
