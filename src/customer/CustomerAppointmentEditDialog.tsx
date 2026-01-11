import Dialog from "../components/Dialog";
import { createSignal } from "solid-js";
import CustomerAppointmentDetails from "./CustomerAppointmentDetails";
import { useTranslation } from "../lang/translate";

export default function CustomerAppointmentEditDialog(props: {
  customerId: number;
  show: boolean;
  setShow: (show: boolean) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = createSignal<number | null | undefined>(
    undefined
  );

  return (
    <Dialog
      show={props.show}
      setShow={props.setShow}
      title={t("customer.appointment.dialogTitle")}
    >
      <CustomerAppointmentDetails
        customerId={props.customerId}
        selectedId={selectedId() ?? null}
        setSelectedId={setSelectedId}
        onUpdate={props.onUpdate}
      />
    </Dialog>
  );
}
