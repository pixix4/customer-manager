import Dialog from "../components/Dialog";
import { createSignal, Show } from "solid-js";
import SplitView from "../components/SplitView";
import EmployeeList from "./EmployeeList";
import EmployeeDetails from "./EmployeeDetails";
import { createEmployeeListResource } from "../model";
import { useTranslation } from "../lang/translate";

export default function EmployeeEditDialog(props: {
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = createSignal<number | null | undefined>(
    undefined
  );

  const [employees, { refetch }] = createEmployeeListResource();

  return (
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("employee.dialogTitle")}
      actionLabel={t("employee.create")}
      onAction={() => setSelectedId(null)}
    >
      <SplitView
        initialSplit={25}
        left={
          <EmployeeList
            employees={employees}
            selectedId={selectedId()}
            setSelectedId={setSelectedId}
          />
        }
        right={
          <Show when={selectedId() !== undefined}>
            <EmployeeDetails
              selectedId={selectedId() ?? null}
              setSelectedId={setSelectedId}
              onUpdate={refetch}
            />
          </Show>
        }
      />
    </Dialog>
  );
}
