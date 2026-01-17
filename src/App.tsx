import { createSignal, Show } from "solid-js";
import styles from "./App.module.css";
import EmployeeEditDialog from "./employee/EmployeeEditDialog";
import {
  RiSystemSettings4Fill,
  RiUserFacesAccountCircleFill,
} from "solid-icons/ri";
import { useTranslation } from "./preferences";
import SettingsDialog from "./settings/SettingsDialog";
import CustomerList from "./customer/CustomerList";
import { autofocus } from "@solid-primitives/autofocus";
import { createCustomerListResource } from "./model";
import SplitView from "./components/SplitView";
import CustomerDetails from "./customer/CustomerDetails";

export default function App() {
  const t = useTranslation();

  const [search, setSearch] = createSignal("");
  const [showEmployeeEditDialog, setShowEmployeeEditDialog] =
    createSignal(false);
  const [showSettingsDialog, setShowSettingsDialog] = createSignal(false);

  const [selectedId, setSelectedId] = createSignal<number | null | undefined>(
    undefined
  );
  const [customers, { refetch }] = createCustomerListResource();

  return (
    <>
      <div class={styles.app}>
        <header class={styles.titleBar}>
          <div class={styles.titleBarLeft}>
            <button
              class={styles.titleBarButton}
              onClick={() => setSelectedId(null)}
            >
              {t("customer.create")}
            </button>
          </div>
          <div class={styles.titleBarCenter}>
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
          <div class={styles.titleBarRight}>
            <button
              class={styles.titleBarButton}
              onClick={() => setShowEmployeeEditDialog((x) => !x)}
              title={t("employee.dialogTitle")}
            >
              <RiUserFacesAccountCircleFill />
            </button>
            <button
              class={styles.titleBarButton}
              onClick={() => setShowSettingsDialog((x) => !x)}
              title={t("settings.title")}
            >
              <RiSystemSettings4Fill />
            </button>
          </div>
        </header>
        <main class={styles.content}>
          <SplitView
            initialSplit={25}
            left={
              <CustomerList
                customers={customers}
                selectedId={selectedId()}
                setSelectedId={setSelectedId}
                search={search()}
              />
            }
            right={
              <Show when={selectedId() !== undefined}>
                <CustomerDetails
                  selectedId={selectedId() ?? null}
                  setSelectedId={setSelectedId}
                  onUpdate={refetch}
                />
              </Show>
            }
          />
        </main>
      </div>

      <EmployeeEditDialog
        show={showEmployeeEditDialog()}
        setShow={setShowEmployeeEditDialog}
      />
      <SettingsDialog
        show={showSettingsDialog()}
        setShow={setShowSettingsDialog}
      />
    </>
  );
}
