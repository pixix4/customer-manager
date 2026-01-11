import { invoke } from "@tauri-apps/api/core";
import { Accessor, createResource, ResourceReturn } from "solid-js";

export type EmployeeDto = {
  id: number;
  name: string;
};

export type EditEmployeeDto = {
  id: number | null;
  name: string;
};

export type CustomerDto = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  address_street: string;
  address_city: string;
  phone: string;
  mobile_phone: string;
  birthdate: string | null;
  customer_since: string | null;
  note: string;
  responsible_employee: EmployeeDto | null;
};

export type EditCustomerDto = {
  id: number | null;
  title: string;
  first_name: string;
  last_name: string;
  address_street: string;
  address_city: string;
  phone: string;
  mobile_phone: string;
  birthdate: string | null;
  customer_since: string | null;
  note: string;
  responsible_employee_id: number | null;
};

export type CustomerAppointmentDto = {
  id: number;
  customer_id: number;
  number: number;
  start_date: string;
  duration_minutes: number;
  end_date: string;
  period_days: number | null;
  treatment: string;
  employee: EmployeeDto | null;
};

export type EditCustomerAppointmentDto = {
  id: number | null;
  customer_id: number;
  start_date: string;
  duration_minutes: number;
  treatment: string;
  employee_id: number | null;
};

export async function getEmployeeList(): Promise<EmployeeDto[]> {
  return await invoke<EmployeeDto[]>("get_employee_list");
}

export async function getEmployeeById(
  id: number | null
): Promise<EmployeeDto | null> {
  if (id == null) {
    return null;
  }

  return (await invoke<EmployeeDto>("get_employee_by_id", { id })) ?? null;
}

export async function storeEmployee(
  employee: EditEmployeeDto
): Promise<number> {
  return await invoke<number>("store_employee", { employee });
}

export async function deleteEmployee(id: number) {
  await invoke("delete_employee", { id });
}

export function createEmployeeListResource(): ResourceReturn<EmployeeDto[]> {
  return createResource(getEmployeeList);
}

export function createEmployeeByIdResource(
  id: Accessor<number | null>
): ResourceReturn<EmployeeDto | null> {
  return createResource(id, getEmployeeById);
}

export async function getCustomerList(): Promise<CustomerDto[]> {
  return await invoke<CustomerDto[]>("get_customer_list");
}

export async function getCustomerById(
  id: number | null
): Promise<CustomerDto | null> {
  if (id == null) {
    return null;
  }

  return (await invoke<CustomerDto>("get_customer_by_id", { id })) ?? null;
}

export async function storeCustomer(
  customer: EditCustomerDto
): Promise<number> {
  return await invoke<number>("store_customer", { customer });
}

export async function deleteCustomer(id: number) {
  await invoke("delete_customer", { id });
}

export function createCustomerListResource(): ResourceReturn<CustomerDto[]> {
  return createResource(getCustomerList);
}

export function createCustomerByIdResource(
  id: Accessor<number | null>
): ResourceReturn<CustomerDto | null> {
  return createResource(id, getCustomerById);
}

export async function getCustomerAppointmentList(
  customerId: number
): Promise<CustomerAppointmentDto[]> {
  return await invoke<CustomerAppointmentDto[]>(
    "get_customer_appointment_list",
    {
      customerId,
    }
  );
}

export async function getCustomerAppointmentById(
  id: number | null
): Promise<CustomerAppointmentDto | null> {
  if (id == null) {
    return null;
  }

  return (
    (await invoke<CustomerAppointmentDto>("get_customer_appointment_by_id", {
      id,
    })) ?? null
  );
}

export async function storeCustomerAppointment(
  appointment: EditCustomerAppointmentDto
): Promise<number> {
  return await invoke<number>("store_customer_appointment", { appointment });
}

export async function deleteCustomerAppointment(id: number) {
  await invoke("delete_customer_appointment", { id });
}

export function createCustomerAppointmentListResource(
  customerId: Accessor<number>
): ResourceReturn<CustomerAppointmentDto[]> {
  return createResource(customerId, getCustomerAppointmentList);
}

export function createCustomerAppointmentByIdResource(
  id: Accessor<number | null>
): ResourceReturn<CustomerAppointmentDto | null> {
  return createResource(id, getCustomerAppointmentById);
}
