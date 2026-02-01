import { createResource, createSignal, Show } from "solid-js";
import TextInput from "../components/input/TextInput";
import styles from "./CustomerDetails.module.css";
import Button from "../components/Button";
import {
  deleteCustomer,
  EditCustomerDto,
  getCustomerById,
  getEmployeeList,
  storeCustomer,
} from "../model";
import { useTranslation } from "../translation";
import InputGroup from "../components/InputGroup";
import SelectBox, { SelectBoxPossibleValue } from "../components/SelectBox";
import SplitView from "../components/SplitView";
import CustomerAppointmentList from "./CustomerAppointmentList";
import DateInput from "../components/input/DateInput";
import MessageBox from "../components/MessageBox";
import { createEditDraft } from "../hooks/form";

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
  onHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}) {
  const { t } = useTranslation();

  const [deleteMessageBox, setDeleteMessageBox] = createSignal(false);
  const [employeeEntries] = createResource(getEmployeeEntries);

  const draft = createEditDraft<EditCustomerDto>({
    selectedId: () => props.selectedId,
    setParentDirty: props.onHasUnsavedChanges,
    empty: emptyEditData,
    equals: areEqual,
    load: async (id) => {
      const data = await getCustomerById(id);
      if (data === null) {
        return null;
      }

      return {
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
    },
  });

  const storeData = async () => {
    const data = { ...draft.editData() };
    data.id = await storeCustomer(data);
    draft.commitSaved(data);

    props.onUpdate();
    props.setSelectedId(data.id);
  };

  const deleteData = async () => {
    if (props.selectedId === null) {
      return;
    }

    await deleteCustomer(props.selectedId);
    draft.reset();

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
                value={draft.editData().title}
                onChange={(v) => draft.handleChange("title", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.firstName")}
                value={draft.editData().first_name}
                onChange={(v) => draft.handleChange("first_name", v)}
              />
              <TextInput
                label={t("customer.lastName")}
                value={draft.editData().last_name}
                onChange={(v) => draft.handleChange("last_name", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.addressCity")}
                value={draft.editData().address_city}
                onChange={(v) => draft.handleChange("address_city", v)}
              />
              <TextInput
                label={t("customer.addressStreet")}
                value={draft.editData().address_street}
                onChange={(v) => draft.handleChange("address_street", v)}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                label={t("customer.phone")}
                value={draft.editData().phone}
                onChange={(v) => draft.handleChange("phone", v)}
              />
              <TextInput
                label={t("customer.mobilePhone")}
                value={draft.editData().mobile_phone}
                onChange={(v) => draft.handleChange("mobile_phone", v)}
              />
            </InputGroup>
            <InputGroup>
              <DateInput
                label={t("customer.birthdate")}
                value={draft.editData().birthdate ?? ""}
                onChange={(v) => draft.handleChange("birthdate", v)}
              />
              <DateInput
                label={t("customer.customerSince")}
                value={draft.editData().customer_since ?? ""}
                onChange={(v) => draft.handleChange("customer_since", v)}
              />
            </InputGroup>
            <InputGroup>
              <SelectBox
                label={t("customer.responsibleEmployee")}
                selected={draft.editData().responsible_employee_id}
                possibleValues={employeeEntries() ?? []}
                onSelect={(value) =>
                  draft.handleChange(
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
              value={draft.editData().note}
              onChange={(v) => draft.handleChange("note", v)}
              rows={3}
            />
          </div>
        }
      />

      <div class={styles.actionRow}>
        <Show when={props.selectedId !== null}>
          <Button color="danger" onClick={() => setDeleteMessageBox(true)}>
            {t("general.delete")}
          </Button>
          <div class={styles.idHint}>
            {t("customer.idHint", { id: props.selectedId ?? -1 })}
          </div>
        </Show>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData} disabled={!draft.isDirty()}>
          {t("general.save")}
        </Button>
      </div>

      <Show when={props.selectedId !== null}>
        <CustomerAppointmentList customerId={props.selectedId ?? 0} />
      </Show>

      <MessageBox
        show={deleteMessageBox()}
        setShow={setDeleteMessageBox}
        title={t("customer.delete")}
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
          {t("customer.deleteMessage", { id: props.selectedId ?? -1 })}
        </span>
      </MessageBox>
    </div>
  );
}
