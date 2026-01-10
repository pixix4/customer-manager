import {
  Accessor,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";

export function filterUndefined<T>(list: (T | undefined | null)[]): T[] {
  const result: T[] = [];

  for (let entry of list) {
    if (entry !== undefined && entry !== null) {
      result.push(entry);
    }
  }

  return result;
}

function getElementSize(target: Element | false | undefined | null): DOMRect {
  if (!target) {
    return new DOMRect();
  }
  return target.getBoundingClientRect();
}

export function createBoundingRect(
  target: Accessor<Element | false | undefined | null>
): Accessor<DOMRect> {
  const [rect, setRect] = createSignal(new DOMRect());

  const resizeObserver = new ResizeObserver(([e]) =>
    setRect(getElementSize(e.target))
  );
  onCleanup(() => resizeObserver.disconnect());

  createEffect(() => {
    const el = target();
    if (el) {
      setRect(getElementSize(el));
      resizeObserver.observe(el);
      onCleanup(() => resizeObserver.unobserve(el));
    }
  });

  return rect;
}
