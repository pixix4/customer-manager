import { invoke } from "@tauri-apps/api/core";
import { Accessor, createResource, Resource, ResourceReturn } from "solid-js";

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
  responsible_employee_id: number | null;
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
