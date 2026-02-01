import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";

type Equals<T> = (a: T, b: T) => boolean;

const defaultEquals = <T,>(a: T, b: T) =>
  JSON.stringify(a) === JSON.stringify(b);

export function createEditDraft<T extends Record<string, unknown>>(opts: {
  selectedId: Accessor<number | null>;
  empty: (() => T) | T;
  load: (id: number) => Promise<T | null>;
  setParentDirty?: (dirty: boolean) => void;
  equals?: Equals<T>;
}) {
  const equals = opts.equals ?? defaultEquals;

  const getEmptyValue = (): T =>
    typeof opts.empty === "function" ? (opts.empty as () => T)() : opts.empty;

  const initEmptyValue = getEmptyValue();
  const [baseline, setBaseline] = createSignal<T>(initEmptyValue);
  const [editData, setEditData] = createSignal<T>(initEmptyValue);

  // load/reset when selection changes
  createEffect(() => {
    const id = opts.selectedId();
    if (id === null) {
      const normalized = getEmptyValue();
      setBaseline(() => normalized);
      setEditData(() => normalized);
      return;
    }

    // Cancel pattern for async loads: only apply latest
    let cancelled = false;

    (async () => {
      const loaded = await opts.load(id);
      if (cancelled) return;

      const normalized = loaded ?? getEmptyValue();
      setBaseline(() => normalized);
      setEditData(() => normalized);
    })();

    onCleanup(() => {
      cancelled = true;
    });
  });

  const isDirty = createMemo(() => {
    const b = baseline();
    const e = editData();
    if (!b || !e) return false;
    return !equals(b, e);
  });

  if (opts.setParentDirty) {
    createEffect(() => opts.setParentDirty!(isDirty()));
  }

  const reset = () => setEditData(() => baseline());

  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setEditData((prev) => (prev ? ({ ...prev, [key]: value } as T) : prev));
  };

  const patch = (partial: (prev: T) => Partial<T>) => {
    setEditData((prev) => ({ ...prev, ...partial(prev) }) as T);
  };

  const commitSaved = (saved?: T) => {
    const next = saved ?? editData();
    setBaseline(() => next);
    setEditData(() => next);
  };

  return {
    editData,
    setEditData,
    baseline,
    isDirty,
    reset,
    handleChange,
    patch,
    commitSaved,
  };
}
