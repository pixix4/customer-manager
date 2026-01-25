import { createSignal, For, Match, Switch } from "solid-js";
import styles from "./CustomerAppointmentList.module.css";
import {
  createCustomerAppointmentListResource,
  CustomerAppointmentDto,
} from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";
import CustomerAppointmentEditDialog from "./CustomerAppointmentEditDialog";
import { useTranslation } from "../translation";
import { formatDays, formatMinutes } from "../datetime";
import Button from "../components/Button";
import { appConfig } from "../appConfig";

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

export default function CustomerAppointmentList(props: { customerId: number }) {
  const { t } = useTranslation();

  const [appointments, { refetch }] = createCustomerAppointmentListResource(
    () => props.customerId,
  );

  const [selectedId, setSelectedId] = createSignal<number | null | undefined>(
    undefined,
  );

  const formatter = () =>
    new Intl.DateTimeFormat(appConfig("general.language"), options);

  return (
    <div class={styles.appointments}>
      <div class={styles.header}>
        <span class={styles.headerTitle}>
          {t("customer.appointment.title")}
        </span>
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
                <th>{t("customer.appointment.price")}</th>
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
                      formatter={formatter()}
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
  formatter: Intl.DateTimeFormat;
}) {
  return (
    <tr onClick={() => props.setSelectedId(props.appointment.id)}>
      <td>{props.appointment.number}</td>
      <td>{props.formatter.format(new Date(props.appointment.start_date))}</td>
      <td>{formatMinutes(props.appointment.duration_minutes)}</td>
      <td>{props.formatter.format(new Date(props.appointment.end_date))}</td>
      <td>{formatDays(props.appointment.period_days)}</td>
      <td>{(props.appointment.price / 100).toFixed(2) + " €"}</td>
      <td>{props.appointment.treatment}</td>
      <td>{props.appointment.employee?.name ?? "---"}</td>
    </tr>
  );
}
