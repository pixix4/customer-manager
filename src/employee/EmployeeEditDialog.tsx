import Dialog from "../components/Dialog";
import { Show } from "solid-js";
import SplitView from "../components/SplitView";
import EmployeeList from "./EmployeeList";
import EmployeeDetails from "./EmployeeDetails";
import { createEmployeeListResource } from "../model";
import { useTranslation } from "../translation";
import { createGuardedSelectedId } from "../hooks/masterDetails";
import MessageBox from "../components/MessageBox";

export default function EmployeeEditDialog(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const { t } = useTranslation();

  const sel = createGuardedSelectedId(undefined);

  const [employees, { refetch }] = createEmployeeListResource();

  return (
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("employee.dialogTitle")}
      actionLabel={t("employee.create")}
      onAction={() => sel.requestSelect(null)}
    >
      <>
        <SplitView
          initialSplit={25}
          left={
            <EmployeeList
              employees={employees}
              selectedId={sel.selectedId()}
              setSelectedId={sel.requestSelect}
            />
          }
          right={
            <Show when={sel.selectedId() !== undefined}>
              <EmployeeDetails
                selectedId={sel.selectedId() ?? null}
                setSelectedId={sel.requestSelect}
                onUpdate={refetch}
                onHasUnsavedChanges={sel.setHasUnsavedChanges}
              />
            </Show>
          }
        />

        <MessageBox {...sel.messageBoxProps()} />
      </>
    </Dialog>
  );
}
