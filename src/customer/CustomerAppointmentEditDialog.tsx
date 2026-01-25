import Dialog from "../components/Dialog";
import CustomerAppointmentDetails from "./CustomerAppointmentDetails";
import { useTranslation } from "../translation";

export default function CustomerAppointmentEditDialog(props: {
  customerId: number;
  selectedId: number | null | undefined;
  setSelectedId: (id: number | null | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      show={props.selectedId !== undefined}
      setShow={() => props.setSelectedId(undefined)}
      title={t("customer.appointment.dialogTitle")}
    >
      <CustomerAppointmentDetails
        customerId={props.customerId}
        selectedId={props.selectedId ?? null}
        setSelectedId={props.setSelectedId}
        onUpdate={props.onUpdate}
      />
    </Dialog>
  );
}
