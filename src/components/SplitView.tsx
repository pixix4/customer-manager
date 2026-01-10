import { createSignal, JSX } from "solid-js";
import styles from "./SplitView.module.css";
import { createBoundingRect } from "../utils";

export default function SplitView(props: {
  left: JSX.Element;
  right: JSX.Element;
  initialSplit?: number;
  minLeftSplit?: number;
  minRightSplit?: number;
}) {
  const [split, setSplit] = createSignal(props.initialSplit ?? 50);

  const setSaveSplit = (split: number) => {
    const minSplit = props.minLeftSplit ?? 5;
    const maxSplit = 100 - (props.minLeftSplit ?? 5);

    setSplit(Math.min(maxSplit, Math.max(minSplit, split)));
  };

  let splitViewRef!: HTMLDivElement;
  const viewRect = createBoundingRect(() => splitViewRef);

  return (
    <div
      ref={splitViewRef}
      class={styles.splitView}
      style={{ ["--split"]: `${split()}%` }}
    >
      <div class={styles.left}>{props.left}</div>
      <div class={styles.right}>{props.right}</div>
      <HandleBar rect={viewRect()} onChange={setSaveSplit} />
    </div>
  );
}

function HandleBar(props: { rect: DOMRect; onChange: (size: number) => void }) {
  const [isDragging, setIsDragging] = createSignal(false);

  function pointerDownHandler(e: PointerEvent) {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function pointerMoveHandler(e: PointerEvent) {
    e.preventDefault();
    if (isDragging()) {
      const x = e.clientX - props.rect.left;
      const size = props.rect.width;
      props.onChange((x / size) * 100);
    }
  }

  function pointerUpHandler() {
    setIsDragging(false);
  }

  return (
    <div
      class={styles.handleBar}
      onPointerDown={pointerDownHandler}
      onPointerMove={pointerMoveHandler}
      onPointerUp={pointerUpHandler}
      onPointerLeave={pointerUpHandler}
      onPointerCancel={pointerUpHandler}
    />
  );
}
