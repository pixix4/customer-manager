import { For, Match, Resource, Switch } from "solid-js";
import styles from "./CustomerList.module.css";
import { CustomerDto } from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";

export default function CustomerList(props: {
  customers: Resource<CustomerDto[]>;
  selectedId: number | null | undefined;
  setSelectedId: (id: number) => void;
  search: string;
}) {
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
              <For each={props.customers()}>
                {(customer) => {
                  return (
                    <div
                      class={styles.customerListEntry}
                      classList={{
                        [styles.selected]: customer.id === props.selectedId,
                      }}
                      onClick={() => props.setSelectedId(customer.id)}
                    >
                      {customer.first_name + " " + customer.last_name}
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
