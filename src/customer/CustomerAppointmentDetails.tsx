import { createEffect, createResource, createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
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
import InputGroup from "../components/InputGroup";
import {
  getCurrentDateTime,
  getDateFromDateTime,
  getTimeFromDateTime,
  updateDateTimeWithDate,
  updateDateTimeWithTime,
} from "../datetime";
import NumberInput from "../components/input/NumberInput";
import DateInput from "../components/input/DateInput";
import TimeInput from "../components/input/TimeInput";

const emptyEditData: EditCustomerAppointmentDto = {
  id: null,
  customer_id: 0,
  start_date: "",
  duration_minutes: 0,
  treatment: "",
  price: 0,
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
    () => props.selectedId,
  );
  const [employeeEntries] = createResource(getEmployeeEntries);

  const [editData, setEditData] = createSignal<EditCustomerAppointmentDto>({
    ...emptyEditData,
  });
  const handleChange = <K extends keyof EditCustomerAppointmentDto>(
    key: K,
    value: EditCustomerAppointmentDto[K],
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
        price: data.price,
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
        <DateInput
          label={t("customer.appointment.startDate")}
          value={getDateFromDateTime(editData().start_date)}
          onChange={setStartDate}
        />
        <TimeInput
          label={t("customer.appointment.startDate")}
          value={getTimeFromDateTime(editData().start_date)}
          onChange={setStartTime}
        />
      </InputGroup>
      <InputGroup>
        <NumberInput
          label={t("customer.appointment.duration")}
          value={editData().duration_minutes}
          onChange={(v) => handleChange("duration_minutes", v)}
          min={0}
          prefix={<span>min</span>}
        />
        <SelectBox
          label={t("customer.responsibleEmployee")}
          selected={editData().employee_id}
          possibleValues={employeeEntries() ?? []}
          onSelect={(value) =>
            handleChange("employee_id", value as number | null)
          }
        />
        <NumberInput
          label={t("customer.appointment.price")}
          value={editData().price}
          onChange={(v) => handleChange("price", v)}
          decimalPlaces={2}
          prefix={<span>€</span>}
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
