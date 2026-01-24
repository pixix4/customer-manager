import { createSignal, Match, Switch } from "solid-js";
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
    undefined,
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
              <Switch>
                <Match when={selectedId() === undefined}>
                  <WelcomeScreen />
                </Match>
                <Match when={selectedId() !== undefined}>
                  <CustomerDetails
                    selectedId={selectedId() ?? null}
                    setSelectedId={setSelectedId}
                    onUpdate={refetch}
                  />
                </Match>
              </Switch>
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

function WelcomeScreen() {
  return (
    <div class={styles.welcome}>
      <svg
        viewBox="0 0 96 96"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        class={styles.welcomeIcon}
      >
        <defs>
          <mask id="cardContents">
            <rect width="100%" height="100%" fill="black" />
            <rect width="96" height="64" rx="8" ry="8" fill="white" />

            <g transform="translate(8, 14) scale(1.5)">
              <path
                fill="black"
                d="M20 22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"
              ></path>
            </g>

            <rect x="48" y="19" width="32" height="4" rx="2" fill="black" />
            <rect x="48" y="29" width="32" height="4" rx="2" fill="black" />
            <rect x="48" y="39" width="20" height="4" rx="2" fill="black" />
          </mask>

          <mask id="cardClipTop">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x="-3"
              y="4"
              width="102"
              height="64"
              rx="8"
              ry="8"
              fill="black"
            />
          </mask>
          <mask id="cardClipMiddle">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x="-3"
              y="4.5"
              width="102"
              height="64"
              rx="8"
              ry="8"
              fill="black"
            />
          </mask>
          <mask id="cardClipBottom">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x="-3"
              y="5"
              width="102"
              height="64"
              rx="8"
              ry="8"
              fill="black"
            />
          </mask>

          <g id="cardStack">
            <g
              transform="translate(0, -4) scale(0.82)"
              transform-origin="center"
            >
              <rect
                id="cardStub3"
                width="96"
                height="64"
                rx="8"
                fill="currentColor"
                mask="url(#cardClipTop)"
              />
            </g>
            <g
              transform="translate(0, 5) scale(0.88)"
              transform-origin="center"
            >
              <rect
                id="cardStub2"
                width="96"
                height="64"
                rx="8"
                fill="currentColor"
                mask="url(#cardClipMiddle)"
              />
            </g>
            <g
              transform="translate(0, 15) scale(0.94)"
              transform-origin="center"
            >
              <rect
                id="cardStub1"
                width="96"
                height="64"
                rx="8"
                fill="currentColor"
                mask="url(#cardClipBottom)"
              />
            </g>
            <g transform="translate(0, 26)" transform-origin="center">
              <rect
                id="card"
                width="96"
                height="64"
                rx="8"
                fill="currentColor"
                mask="url(#cardContents)"
              />
            </g>
          </g>
        </defs>

        <use href="#cardStack" />
      </svg>
    </div>
  );
}
