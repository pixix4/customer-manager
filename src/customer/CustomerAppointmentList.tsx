import { createSignal, For, Match, Switch } from "solid-js";
import styles from "./CustomerAppointmentList.module.css";
import {
  createCustomerAppointmentListResource,
  CustomerAppointmentDto,
} from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";
import CustomerAppointmentEditDialog from "./CustomerAppointmentEditDialog";
import { useTranslation } from "../lang/translate";
import { formatDays, formatMinutes } from "../datetime";
import Button from "../components/Button";

export default function CustomerAppointmentList(props: { customerId: number }) {
  const { t } = useTranslation();

  const [appointments, { refetch }] = createCustomerAppointmentListResource(
    () => props.customerId
  );

  const [selectedId, setSelectedId] = createSignal<number | null | undefined>(
    undefined
  );

  return (
    <div class={styles.appointments}>
      <div class={styles.header}>
        <span class={styles.headerTitle}>Appointments</span>
        <div class={styles.headerSpacer}></div>
        <Button color="flat" onClick={() => setSelectedId(null)}>
          {t("customer.appointment.create")}
        </Button>
      </div>
      <Switch>
        <Match when={appointments.loading}>
          <div class={styles.loading}>
            <LoadingSpinner size={3} />
          </div>
        </Match>
        <Match when={appointments.error}>
          <div class={styles.error}>
            <RiSystemErrorWarningLine />
          </div>
        </Match>
        <Match when={appointments()}>
          <table class={styles.table}>
            <thead>
              <tr>
                <th>{t("customer.appointment.number")}</th>
                <th>{t("customer.appointment.startDate")}</th>
                <th>{t("customer.appointment.duration")}</th>
                <th>{t("customer.appointment.endTime")}</th>
                <th>{t("customer.appointment.period")}</th>
                <th>{t("customer.appointment.treatment")}</th>
                <th>{t("customer.appointment.employee")}</th>
              </tr>
            </thead>
            <tbody>
              <For each={appointments()}>
                {(appointment) => {
                  return (
                    <CustomerAppointmentListEntry
                      appointment={appointment}
                      setSelectedId={setSelectedId}
                    />
                  );
                }}
              </For>
            </tbody>
          </table>
        </Match>
      </Switch>

      <CustomerAppointmentEditDialog
        customerId={props.customerId}
        selectedId={selectedId()}
        setSelectedId={setSelectedId}
        onUpdate={refetch}
      />
    </div>
  );
}

function CustomerAppointmentListEntry(props: {
  appointment: CustomerAppointmentDto;
  setSelectedId: (id: number) => void;
}) {
  return (
    <tr onClick={() => props.setSelectedId(props.appointment.id)}>
      <td>{props.appointment.number}</td>
      <td>{new Date(props.appointment.start_date).toLocaleString()}</td>
      <td>{formatMinutes(props.appointment.duration_minutes)}</td>
      <td>{new Date(props.appointment.end_date).toLocaleString()}</td>
      <td>{formatDays(props.appointment.period_days)}</td>
      <td>{props.appointment.treatment}</td>
      <td>{props.appointment.employee?.name ?? "---"}</td>
    </tr>
  );
}
