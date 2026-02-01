import { createEffect, createResource, createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
import styles from "./CustomerAppointmentDetails.module.css";
import Button from "../components/Button";
import {
  createCustomerByIdResource,
  deleteCustomerAppointment,
  EditCustomerAppointmentDto,
  getCustomerAppointmentById,
  getEmployeeList,
  storeCustomerAppointment,
} from "../model";
import { useTranslation } from "../translation";
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
import MessageBox from "../components/MessageBox";
import { createEditDraft } from "../hooks/form";

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

function areEqual(
  a: EditCustomerAppointmentDto,
  b: EditCustomerAppointmentDto,
): boolean {
  if (a.customer_id !== b.customer_id) return false;
  if (a.start_date !== b.start_date) return false;
  if (a.duration_minutes !== b.duration_minutes) return false;
  if (a.treatment !== b.treatment) return false;
  if (a.price !== b.price) return false;
  if (a.employee_id !== b.employee_id) return false;

  return true;
}

export default function CustomerAppointmentDetails(props: {
  customerId: number;
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  const [deleteMessageBox, setDeleteMessageBox] = createSignal(false);
  const [customer] = createCustomerByIdResource(() => props.customerId);
  const [employeeEntries] = createResource(getEmployeeEntries);

  const draft = createEditDraft<EditCustomerAppointmentDto>({
    selectedId: () => props.selectedId,
    empty: {
      ...emptyEditData,
      customer_id: props.customerId,
      start_date: getCurrentDateTime(),
    },
    equals: areEqual,
    load: async (id) => {
      const data = await getCustomerAppointmentById(id);
      if (data === null) {
        return null;
      }

      return {
        id: data.id,
        customer_id: props.customerId,
        start_date: data.start_date,
        duration_minutes: data.duration_minutes,
        treatment: data.treatment,
        price: data.price,
        employee_id: data.employee?.id ?? null,
      };
    },
  });

  createEffect(() => {
    if (props.selectedId === null && customer()) {
      draft.handleChange(
        "employee_id",
        customer()?.responsible_employee?.id ?? null,
      );
    }
  });

  const setStartDate = (value: string) => {
    draft.patch((prev) => {
      return {
        start_date: updateDateTimeWithDate(prev.start_date, value),
      };
    });
  };

  const setStartTime = (value: string) => {
    draft.patch((prev) => {
      return {
        start_date: updateDateTimeWithTime(prev.start_date, value),
      };
    });
  };

  const storeData = async () => {
    const data = { ...draft.editData() };
    data.id = await storeCustomerAppointment(data);
    draft.commitSaved(data);

    props.onUpdate();
    props.setSelectedId(undefined);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteCustomerAppointment(props.selectedId);
    draft.reset();

    props.onUpdate();
    props.setSelectedId(undefined);
  };

  return (
    <div class={styles.appointmentDetails}>
      <InputGroup>
        <DateInput
          label={t("customer.appointment.startDate")}
          value={getDateFromDateTime(draft.editData().start_date)}
          onChange={setStartDate}
        />
        <TimeInput
          label={t("customer.appointment.startTime")}
          value={getTimeFromDateTime(draft.editData().start_date)}
          onChange={setStartTime}
        />
      </InputGroup>
      <InputGroup>
        <NumberInput
          label={t("customer.appointment.duration")}
          value={draft.editData().duration_minutes}
          onChange={(v) => draft.handleChange("duration_minutes", v)}
          min={0}
          prefix={<span>min</span>}
        />
        <SelectBox
          label={t("customer.responsibleEmployee")}
          selected={draft.editData().employee_id}
          possibleValues={employeeEntries() ?? []}
          onSelect={(value) =>
            draft.handleChange("employee_id", value as number | null)
          }
        />
        <NumberInput
          label={t("customer.appointment.price")}
          value={draft.editData().price}
          onChange={(v) => draft.handleChange("price", v)}
          decimalPlaces={2}
          prefix={<span>€</span>}
        />
      </InputGroup>
      <InputGroup>
        <TextInput
          label={t("customer.appointment.treatment")}
          value={draft.editData().treatment}
          onChange={(v) => draft.handleChange("treatment", v)}
          rows={5}
        />
      </InputGroup>

      <div class={styles.actionRow}>
        <Show when={props.selectedId !== null}>
          <Button color="danger" onClick={() => setDeleteMessageBox(true)}>
            {t("general.delete")}
          </Button>
          <div class={styles.idHint}>
            {t("customer.appointment.idHint", { id: props.selectedId ?? -1 })}
          </div>
        </Show>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData} disabled={!draft.isDirty}>
          {t("general.save")}
        </Button>
      </div>

      <MessageBox
        show={deleteMessageBox()}
        setShow={setDeleteMessageBox}
        title={t("customer.appointment.delete")}
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
          {t("customer.appointment.deleteMessage", {
            id: props.selectedId ?? -1,
          })}
        </span>
      </MessageBox>
    </div>
  );
}
