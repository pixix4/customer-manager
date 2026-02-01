import { createMemo, createSignal } from "solid-js";
import { MessageBoxButton } from "../components/MessageBox";
import { useTranslation } from "../translation";

export type SelectedId = undefined | null | number;

export function createGuardedSelectedId(initial: SelectedId) {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = createSignal<SelectedId>(initial);
  const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);

  const [showConfirm, setShowConfirm] = createSignal(false);
  const [pendingId, setPendingId] = createSignal<SelectedId>(undefined);

  const requestSelect = (next: SelectedId) => {
    if (Object.is(next, selectedId())) return true;

    if (!hasUnsavedChanges() || selectedId() === undefined) {
      setSelectedId(next);
      return true;
    }

    setPendingId(next);
    setShowConfirm(true);
    return false;
  };

  const discard = () => {
    setShowConfirm(false);
    setSelectedId(pendingId());
    setPendingId(undefined);
  };

  const cancel = () => {
    setShowConfirm(false);
    setPendingId(undefined);
  };

  const body = createMemo(() => {
    return <div>{t("masterDetails.dirtyConfirmMessage")}</div>;
  });

  const actions = createMemo<MessageBoxButton[]>(() => {
    return [
      { label: t("masterDetails.discard"), onAction: discard },
      { label: t("general.cancel"), onAction: cancel },
    ];
  });

  // These are props you can spread into <MessageBox .../>
  const messageBoxProps = createMemo(() => ({
    show: showConfirm(),
    setShow: (s: boolean) => {
      if (!s) cancel();
      else setShowConfirm(true);
    },
    title: t("masterDetails.dirtyConfirmTitle"),
    children: body(),
    actions: actions(),
  }));

  return {
    // core selection API
    selectedId,
    setSelectedId,
    requestSelect,

    // dirty API (Details should set this)
    hasUnsavedChanges,
    setHasUnsavedChanges,

    // dialog wiring
    messageBoxProps,
  };
}
