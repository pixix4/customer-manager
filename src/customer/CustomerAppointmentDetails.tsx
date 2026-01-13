import { createEffect, createResource, createSignal, Show } from "solid-js";
import TextInput from "../components/TextInput";
import styles from "./CustomerAppointmentDetails.module.css";
import Button from "../components/Button";
import {
  createCustomerAppointmentByIdResource,
  deleteCustomerAppointment,
  EditCustomerAppointmentDto,
  getEmployeeList,
  storeCustomerAppointment,
} from "../model";
import { useTranslation } from "../preferences";
import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import SimpleInput from "../components/SimpleInput";
import InputGroup from "../components/InputGroup";
import {
  getCurrentDateTime,
  getDateFromDateTime,
  getTimeFromDateTime,
  updateDateTimeWithDate,
  updateDateTimeWithTime,
} from "../datetime";

const emptyEditData: EditCustomerAppointmentDto = {
  id: null,
  customer_id: 0,
  start_date: "",
  duration_minutes: 0,
  treatment: "",
  employee_id: null,
};

async function getEmployeeEntries(): Promise<SelectBoxPossibleValue[]> {
  const employees = await getEmployeeList();
  const entries: SelectBoxPossibleValue[] = employees.map((employee) => {
    return {
      id: employee.id,
      name: employee.name,
    };
  });

  entries.push({
    id: null,
    name: "---",
  });

  return entries;
}

export default function CustomerAppointmentDetails(props: {
  customerId: number;
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const t = useTranslation();

  const [appointment] = createCustomerAppointmentByIdResource(
    () => props.selectedId
  );
  const [employeeEntries] = createResource(getEmployeeEntries);

  const [editData, setEditData] = createSignal<EditCustomerAppointmentDto>({
    ...emptyEditData,
  });
  const handleChange = <K extends keyof EditCustomerAppointmentDto>(
    key: K,
    value: EditCustomerAppointmentDto[K]
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const setStartDate = (value: string) => {
    setEditData((prev) => {
      return {
        ...prev,
        start_date: updateDateTimeWithDate(prev.start_date, value),
      };
    });
  };

  const setStartTime = (value: string) => {
    setEditData((prev) => {
      return {
        ...prev,
        start_date: updateDateTimeWithTime(prev.start_date, value),
      };
    });
  };

  createEffect(async () => {
    if (props.selectedId === null || props.selectedId === undefined) {
      setEditData({
        ...emptyEditData,
        customer_id: props.customerId,
        start_date: getCurrentDateTime(),
      });
      return;
    }

    if (appointment.loading || appointment.error) {
      return;
    }

    const data = appointment();
    if (data) {
      setEditData({
        id: data.id,
        customer_id: props.customerId,
        start_date: data.start_date,
        duration_minutes: data.duration_minutes,
        treatment: data.treatment,
        employee_id: data.employee?.id ?? null,
      });
    } else {
      setEditData({
        ...emptyEditData,
        customer_id: props.customerId,
        start_date: getCurrentDateTime(),
      });
    }
  });

  const storeData = async () => {
    console.log(editData());
    await storeCustomerAppointment(editData());
    props.onUpdate();
    props.setSelectedId(undefined);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteCustomerAppointment(props.selectedId);
    props.onUpdate();
    props.setSelectedId(undefined);
  };

  return (
    <div class={styles.appointmentDetails}>
      <InputGroup>
        <SimpleInput
          label={t("customer.appointment.startDate")}
          value={getDateFromDateTime(editData().start_date)}
          onChange={setStartDate}
          type="date"
        />
        <SimpleInput
          label={t("customer.appointment.startDate")}
          value={getTimeFromDateTime(editData().start_date)}
          onChange={setStartTime}
          type="time"
        />
      </InputGroup>
      <InputGroup>
        <SimpleInput
          label={t("customer.appointment.duration")}
          value={editData().duration_minutes.toString()}
          onChange={(v) => {
            const parsed = parseInt(v);
            if (parsed >= 0) {
              handleChange("duration_minutes", parsed);
            }
          }}
          type="number"
        />
        <SelectBox
          label={t("customer.responsibleEmployee")}
          selected={editData().employee_id}
          possibleValues={employeeEntries() ?? []}
          onSelect={(value) =>
            handleChange("employee_id", value as number | null)
          }
        />
      </InputGroup>
      <InputGroup>
        <TextInput
          label={t("customer.appointment.treatment")}
          value={editData().treatment}
          onChange={(v) => handleChange("treatment", v)}
          rows={5}
        />
      </InputGroup>

      <div class={styles.actionRow}>
        <Button color="danger" onClick={deleteData}>
          {t("general.delete")}
        </Button>
        <Show when={props.selectedId !== null}>
          <div class={styles.idHint}>
            {t("customer.appointment.idHint", { id: props.selectedId ?? -1 })}
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
