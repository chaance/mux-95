import * as React from "react";

interface Position {
  x: number;
  y: number;
}

interface DragState<D extends Element> {
  state: "idle" | "dragging";
  position: Position;
  dragStart: Position;
  constrainedElement: D | null;
}

let pointerCache = {
  isDown: false,
  dragStart: { x: 0, y: 0 },
};

export function useDraggable<
  T extends Element = Element,
  D extends Element = Element,
>(initialPosition: Position) {
  let [dragState, setDragState] = React.useState<DragState<D>>({
    state: pointerCache.isDown ? "dragging" : "idle",
    position: initialPosition,
    dragStart: pointerCache.isDown ? pointerCache.dragStart : { x: 0, y: 0 },
    constrainedElement: null,
  });

  let isDragging = dragState.state === "dragging";

  let constrainedElementRectRef = React.useRef<{
    observer: IntersectionObserver;
    element: D | null;
    entry: IntersectionObserverEntry | null;
  }>(null);

  let handleIntersection = React.useCallback<IntersectionObserverCallback>(
    (entries: IntersectionObserverEntry[]) => {
      if (constrainedElementRectRef.current) {
        constrainedElementRectRef.current.entry = entries[0];
      }
    },
    [],
  );

  let onDragInit = React.useCallback<DragInitHandler<T, D>>(
    (event, constrainedElement) => {
      if (!constrainedElementRectRef.current) {
        constrainedElementRectRef.current = {
          observer: new IntersectionObserver(handleIntersection, {
            threshold: 1,
          }),
          element: constrainedElement ?? null,
          entry: null,
        };
      }

      const observer = constrainedElementRectRef.current.observer;
      observer.disconnect();
      if (constrainedElement) {
        constrainedElementRectRef.current.element = constrainedElement ?? null;
        observer.observe(constrainedElement);
      }

      setDragState((state) => {
        let x = event.clientX - state.position.x;
        let y = event.clientY - state.position.y;
        if (state.state === "idle") {
          pointerCache.isDown = true;
          pointerCache.dragStart = { x, y };
          return {
            state: "dragging",
            dragStart: { x, y },
            position: state.position,
            constrainedElement: constrainedElement ?? null,
          };
        }
        return state;
      });
    },
    [],
  );

  React.useEffect(() => {
    if (dragState.state === "idle") {
      return;
    }

    const abortController = new AbortController();

    function handleDrag(event: PointerEvent) {
      setDragState((state) => {
        let position: Position;
        if (
          state.constrainedElement &&
          constrainedElementRectRef.current &&
          constrainedElementRectRef.current.entry &&
          !constrainedElementRectRef.current.entry.isIntersecting
        ) {
          // TODO handle constraints
          position = {
            x: event.clientX - state.dragStart.x,
            y: event.clientY - state.dragStart.y,
          };
        } else {
          position = {
            x: event.clientX - state.dragStart.x,
            y: event.clientY - state.dragStart.y,
          };
        }

        return {
          state: "dragging",
          dragStart: state.dragStart,
          constrainedElement: state.constrainedElement,
          position,
        };
      });
    }

    function handleDragEnd(event: PointerEvent) {
      abortController.abort();
      pointerCache.isDown = false;
      if (constrainedElementRectRef.current) {
        constrainedElementRectRef.current.element = null;
        const observer = constrainedElementRectRef.current.observer;
        observer?.disconnect();
      }
      setDragState((state) => {
        pointerCache.dragStart = state.dragStart;
        return {
          state: "idle",
          dragStart: state.dragStart,
          position: state.position,
          constrainedElement: null,
        };
      });
    }

    const opts = { signal: abortController.signal };
    document.addEventListener("pointermove", handleDrag, opts);
    document.addEventListener("pointerup", handleDragEnd, opts);
    document.addEventListener("pointercancel", handleDragEnd, opts);
    return () => {
      abortController.abort();
    };
  }, [dragState.state]);

  React.useEffect(() => {
    if (!constrainedElementRectRef.current?.observer) {
      return;
    }
    const observer = constrainedElementRectRef.current.observer;
    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    onDragInit,
    position: dragState.position,
    state: dragState.state,
    isDragging,
  };
}

interface DragInitHandler<T extends Element, D extends Element> {
  (event: PointerEvent, constrainedElement?: D | null): void;
  (event: React.PointerEvent<T>, constrainedElement?: D | null): void;
}
