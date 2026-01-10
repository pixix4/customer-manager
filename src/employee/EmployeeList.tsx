import { createSignal, For, Match, Resource, Switch } from "solid-js";
import styles from "./EmployeeList.module.css";
import { autofocus } from "@solid-primitives/autofocus";
import { EmployeeDto } from "../model";
import LoadingSpinner from "../components/LoadingSpinner";
import { RiSystemErrorWarningLine } from "solid-icons/ri";
import { useTranslation } from "../lang/translate";

export default function EmployeeList(props: {
  employees: Resource<EmployeeDto[]>;
  selectedId: number | null | undefined;
  setSelectedId: (id: number) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = createSignal("");

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
            <For each={props.employees()}>
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
