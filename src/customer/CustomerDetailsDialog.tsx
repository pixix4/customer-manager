import Dialog from "../components/Dialog";
import CustomerDetails from "./CustomerDetails";
import { useTranslation } from "../lang/translate";

export default function CustomerDetailsDialog(props: {
  selectedId: number | null | undefined;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      show={props.selectedId !== undefined}
      setShow={() => props.setSelectedId(undefined)}
      title={t("customer.dialogTitle")}
    >
      <CustomerDetails
        selectedId={props.selectedId ?? null}
        setSelectedId={props.setSelectedId}
        onUpdate={props.onUpdate}
      />
    </Dialog>
  );
}
