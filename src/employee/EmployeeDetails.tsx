import { createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
import styles from "./EmployeeDetails.module.css";
import Button from "../components/Button";
import {
  deleteEmployee,
  EditEmployeeDto,
  getEmployeeById,
  storeEmployee,
} from "../model";
import { useTranslation } from "../translation";
import MessageBox from "../components/MessageBox";
import { createEditDraft } from "../hooks/form";

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
  onHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) {
  const { t } = useTranslation();

  const [deleteMessageBox, setDeleteMessageBox] = createSignal(false);

  const draft = createEditDraft<EditEmployeeDto>({
    selectedId: () => props.selectedId,
    setParentDirty: props.onHasUnsavedChanges,
    empty: emptyEditData,
    equals: areEqual,
    load: async (id) => {
      const data = await getEmployeeById(id);
      if (data === null) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
      };
    },
  });

  const storeData = async () => {
    const data = { ...draft.editData() };
    data.id = await storeEmployee(data);
    draft.commitSaved(data);

    props.onUpdate();
    props.setSelectedId(data.id);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteEmployee(props.selectedId);
    draft.reset();

    props.onUpdate();
    props.setSelectedId(undefined);
  };

  return (
    <div class={styles.employeeDetails}>
      <TextInput
        label={t("employee.name")}
        value={draft.editData().name}
        onChange={(v) => draft.handleChange("name", v)}
      />

      <div class={styles.actionRow}>
        <Show when={props.selectedId !== null}>
          <Button color="danger" onClick={() => setDeleteMessageBox(true)}>
            {t("general.delete")}
          </Button>
          <div class={styles.idHint}>
            {t("employee.idHint", { id: props.selectedId ?? -1 })}
          </div>
        </Show>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData} disabled={!draft.isDirty()}>
          {t("general.save")}
        </Button>
      </div>

      <MessageBox
        show={deleteMessageBox()}
        setShow={setDeleteMessageBox}
        title={t("employee.delete")}
        actions={[
          {
            label: t("general.delete"),
            onAction: deleteData,
            color: "danger",
          },
          {
            label: t("general.cancel"),
            onAction: () => {},
          },
        ]}
      >
        <span>
          {t("employee.deleteMessage", { id: props.selectedId ?? -1 })}
        </span>
      </MessageBox>
    </div>
  );
}
