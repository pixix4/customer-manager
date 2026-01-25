import { For, Match, Resource, Switch } from "solid-js";
import styles from "./CustomerList.module.css";
import { CustomerDto } from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";
import replaceSpecialCharacters from "replace-special-characters";

function searchCustomer(customer: CustomerDto, search: string): boolean {
  const values = [
    customer.first_name,
    customer.last_name,
    customer.address_city,
    customer.address_street,
  ].map((v) => replaceSpecialCharacters(v).toLowerCase());
  const searchValues = search.split(" ");

  for (let searchValue of searchValues) {
    let found = false;
    for (let value of values) {
      if (value.includes(searchValue)) {
        found = true;
        break;
      }
    }

    if (!found) {
      return false;
    }
  }

  return true;
}

function compareCustomer(a: CustomerDto, b: CustomerDto): number {
  const last_name = a.last_name.localeCompare(b.last_name);
  if (last_name !== 0) {
    return last_name;
  }

  const first_name = a.first_name.localeCompare(b.first_name);
  if (first_name !== 0) {
    return first_name;
  }

  return 0;
}

export default function CustomerList(props: {
  customers: Resource<CustomerDto[]>;
  selectedId: number | null | undefined;
  setSelectedId: (id: number) => void;
  search: string;
}) {
  const filteredCustomers = () => {
    const unfiltered = props.customers() ?? [];
    const search = replaceSpecialCharacters(props.search).toLowerCase();
    if (search === "") {
      unfiltered.sort(compareCustomer);
      return unfiltered;
    }

    const filtered = unfiltered.filter((customer) =>
      searchCustomer(customer, search),
    );
    filtered.sort(compareCustomer);
    return filtered;
  };

  return (
    <>
      <div class={styles.customerList}>
        <Switch>
          <Match when={props.customers.loading}>
            <div class={styles.customerListLoading}>
              <LoadingSpinner size={3} />
            </div>
          </Match>
          <Match when={props.customers.error}>
            <div class={styles.customerListError}>
              <RiSystemErrorWarningLine />
            </div>
          </Match>
          <Match when={props.customers()}>
            <div class={styles.customerListContent}>
              <For each={filteredCustomers()}>
                {(customer) => {
                  return (
                    <div
                      class={styles.customerListEntry}
                      classList={{
                        [styles.selected]: customer.id === props.selectedId,
                      }}
                      onClick={() => props.setSelectedId(customer.id)}
                    >
                      {customer.last_name + ", " + customer.first_name}
                    </div>
                  );
                }}
              </For>
            </div>
          </Match>
        </Switch>
      </div>
    </>
  );
}
