import { createEffect, createResource, createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
import styles from "./CustomerDetails.module.css";
import Button from "../components/Button";
import {
  createCustomerByIdResource,
  deleteCustomer,
  EditCustomerDto,
  getEmployeeList,
  storeCustomer,
} from "../model";
import { useTranslation } from "../translation";
import InputGroup from "../components/InputGroup";
import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import SplitView from "../components/SplitView";
import CustomerAppointmentList from "./CustomerAppointmentList";
import DateInput from "../components/input/DateInput";

const emptyEditData: EditCustomerDto = {
  id: null,
  title: "",
  first_name: "",
  last_name: "",
  address_street: "",
  address_city: "",
  phone: "",
  mobile_phone: "",
  birthdate: null,
  customer_since: null,
  note: "",
  responsible_employee_id: null,
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

function areEqual(a: EditCustomerDto, b: EditCustomerDto): boolean {
  if (a.title !== b.title) return false;
  if (a.first_name !== b.first_name) return false;
  if (a.last_name !== b.last_name) return false;
  if (a.address_street !== b.address_street) return false;
  if (a.address_city !== b.address_city) return false;
  if (a.phone !== b.phone) return false;
  if (a.mobile_phone !== b.mobile_phone) return false;
  if (a.birthdate !== b.birthdate) return false;
  if (a.customer_since !== b.customer_since) return false;
  if (a.note !== b.note) return false;
  if (a.responsible_employee_id !== b.responsible_employee_id) return false;

  return true;
}

export default function CustomerDetails(props: {
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  const [customer] = createCustomerByIdResource(() => props.selectedId);
  const [employeeEntries] = createResource(getEmployeeEntries);

  const [editData, setEditData] = createSignal<EditCustomerDto>({
    ...emptyEditData,
  });
  const [baseData, setBaseData] = createSignal<EditCustomerDto>({
    ...emptyEditData,
  });

  const hasChanges = () => !areEqual(editData(), baseData());

  createEffect(async () => {
    if (props.selectedId === null || props.selectedId === undefined) {
      const obj = { ...emptyEditData };

      setEditData(obj);
      setBaseData(obj);

      return;
    }

    if (customer.loading || customer.error) {
      return;
    }

    const data = customer();
    if (data) {
      let obj = {
        id: data.id,
        title: data.title,
        first_name: data.first_name,
        last_name: data.last_name,
        address_street: data.address_street,
        address_city: data.address_city,
        phone: data.phone,
        mobile_phone: data.mobile_phone,
        birthdate: data.birthdate,
        customer_since: data.customer_since,
        note: data.note,
        responsible_employee_id: data.responsible_employee?.id ?? null,
      };

      setEditData(obj);
      setBaseData(obj);
    } else {
      const obj = { ...emptyEditData };

      setEditData(obj);
      setBaseData(obj);
    }
  });

  const handleChange = <K extends keyof EditCustomerDto>(
    key: K,
    value: EditCustomerDto[K],
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const storeData = async () => {
    const obj = editData();

    const id = await storeCustomer(obj);
    setBaseData(obj);

    props.onUpdate();
    props.setSelectedId(id);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteCustomer(props.selectedId);
    props.onUpdate();
    props.setSelectedId(undefined);
  };

  return (
    <div class={styles.customerDetails}>
      <SplitView
        initialSplit={50}
        left={
          <div class={styles.customerFields}>
            <InputGroup>
              <TextInput
                label={t("customer.title")}
                value={editData().title}
                onChange={(v) => handleChange("title", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.firstName")}
                value={editData().first_name}
                onChange={(v) => handleChange("first_name", v)}
              />
              <TextInput
                label={t("customer.lastName")}
                value={editData().last_name}
                onChange={(v) => handleChange("last_name", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.addressCity")}
                value={editData().address_city}
                onChange={(v) => handleChange("address_city", v)}
              />
              <TextInput
                label={t("customer.addressStreet")}
                value={editData().address_street}
                onChange={(v) => handleChange("address_street", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.phone")}
                value={editData().phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <TextInput
                label={t("customer.mobilePhone")}
                value={editData().mobile_phone}
                onChange={(v) => handleChange("mobile_phone", v)}
              />
            </InputGroup>
            <InputGroup>
              <DateInput
                label={t("customer.birthdate")}
                value={editData().birthdate ?? ""}
                onChange={(v) => handleChange("birthdate", v)}
              />
              <DateInput
                label={t("customer.customerSince")}
                value={editData().customer_since ?? ""}
                onChange={(v) => handleChange("customer_since", v)}
              />
            </InputGroup>
            <InputGroup>
              <SelectBox
                label={t("customer.responsibleEmployee")}
                selected={editData().responsible_employee_id}
                possibleValues={employeeEntries() ?? []}
                onSelect={(value) =>
                  handleChange(
                    "responsible_employee_id",
                    value as number | null,
                  )
                }
              />
            </InputGroup>
          </div>
        }
        right={
          <div class={styles.customerNotes}>
            <TextInput
              label={t("customer.note")}
              value={editData().note}
              onChange={(v) => handleChange("note", v)}
              rows={3}
            />
          </div>
        }
      />

      <div class={styles.actionRow}>
        <Button color="danger" onClick={deleteData}>
          {t("general.delete")}
        </Button>
        <Show when={props.selectedId !== null}>
          <div class={styles.idHint}>
            {t("customer.idHint", { id: props.selectedId ?? -1 })}
          </div>
        </Show>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData} disabled={!hasChanges()}>
          {t("general.save")}
        </Button>
      </div>

      <Show when={props.selectedId !== null}>
        <CustomerAppointmentList customerId={props.selectedId ?? 0} />
      </Show>
    </div>
  );
}
