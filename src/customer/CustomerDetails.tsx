import { createEffect, createSignal, Show } from "solid-js";
import TextInput from "../components/TextInput";
import styles from "./CustomerDetails.module.css";
import Button from "../components/Button";
import {
  createCustomerByIdResource,
  deleteCustomer,
  EditCustomerDto,
  storeCustomer,
} from "../model";
import { useTranslation } from "../lang/translate";

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

export default function CustomerDetails(props: {
  selectedId: number | null;
  setSelectedId: (id: number | undefined) => void;
  onUpdate: () => void;
}) {
  const { t } = useTranslation();

  const [customer] = createCustomerByIdResource(() => props.selectedId);

  const [editData, setEditData] = createSignal<EditCustomerDto>({
    ...emptyEditData,
  });
  const handleChange = <K extends keyof EditCustomerDto>(
    key: K,
    value: EditCustomerDto[K]
  ) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  createEffect(async () => {
    if (props.selectedId === null || props.selectedId === undefined) {
      setEditData({ ...emptyEditData });
      return;
    }

    if (customer.loading || customer.error) {
      return;
    }

    const data = customer();
    if (data) {
      setEditData({
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
      });
    } else {
      setEditData({ ...emptyEditData });
    }
  });

  const storeData = async () => {
    const id = await storeCustomer(editData());
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
    <div class={styles.tagDetails}>
      <TextInput
        label={t("customer.title")}
        value={editData().title}
        onChange={(v) => handleChange("title", v)}
      />
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
      <TextInput
        label={t("customer.addressStreet")}
        value={editData().address_street}
        onChange={(v) => handleChange("address_street", v)}
      />
      <TextInput
        label={t("customer.addressCity")}
        value={editData().address_city}
        onChange={(v) => handleChange("address_city", v)}
      />
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

      <div class={styles.actionRow}>
        <Button color="danger" onClick={deleteData}>
          {t("general.delete")}
        </Button>
        <div class={styles.actionRowSpacer}></div>
        <Button onClick={() => props.setSelectedId(undefined)}>
          {t("general.cancel")}
        </Button>
        <Button color="primary" onClick={storeData}>
          {t("general.save")}
        </Button>
      </div>
      <Show when={props.selectedId !== null}>
        <div style="opacity: 0.5; margin-top: 0.6em">
          {t("customer.idHint", { id: props.selectedId ?? -1 })}
        </div>
      </Show>
    </div>
  );
}
