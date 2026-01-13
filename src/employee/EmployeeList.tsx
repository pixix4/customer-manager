import { createSignal, For, Match, Resource, Switch } from "solid-js";
import styles from "./EmployeeList.module.css";
import { autofocus } from "@solid-primitives/autofocus";
import { EmployeeDto } from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";
import { useTranslation } from "../preferences";
import replaceSpecialCharacters from "replace-special-characters";

function searchEmployee(customer: EmployeeDto, search: string): boolean {
  const values = [customer.name].map((v) =>
    replaceSpecialCharacters(v).toLowerCase()
  );
  const searchValues = search.split(" ");

  console.log(values, searchValues);

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

export default function EmployeeList(props: {
  employees: Resource<EmployeeDto[]>;
  selectedId: number | null | undefined;
  setSelectedId: (id: number) => void;
}) {
  const t = useTranslation();
  const [search, setSearch] = createSignal("");

  const filteredEmployees = () => {
    const unfiltered = props.employees() ?? [];
    const s = replaceSpecialCharacters(search()).toLowerCase();
    if (s === "") {
      return unfiltered;
    }

    return unfiltered.filter((customer) => searchEmployee(customer, s));
  };

  return (
    <div class={styles.employeeList}>
      <div class={styles.employeeListSearch}>
        <input
          ref={autofocus}
          autofocus
          class={styles.searchInput}
          placeholder={t("general.searchPlaceholder")}
          type="search"
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
      <Switch>
        <Match when={props.employees.loading}>
          <div class={styles.employeeListLoading}>
            <LoadingSpinner size={3} />
          </div>
        </Match>
        <Match when={props.employees.error}>
          <div class={styles.employeeListError}>
            <RiSystemErrorWarningLine />
          </div>
        </Match>
        <Match when={props.employees()}>
          <div class={styles.employeeListContent}>
            <For each={filteredEmployees()}>
              {(employee) => {
                return (
                  <div
                    class={styles.employeeListEntry}
                    classList={{
                      [styles.selected]: employee.id === props.selectedId,
                    }}
                    onClick={() => props.setSelectedId(employee.id)}
                  >
                    {employee.name}
                  </div>
                );
              }}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
