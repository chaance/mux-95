import * as React from "react";

interface Position {
  x: number;
  y: number;
}

export function useDraggable<T extends Element = Element>(
  initialPosition: Position,
) {
  const [position, setPosition] = React.useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = React.useCallback<MouseEventHandler<T>>(
    (e) => {
      console.log("start");
      setIsDragging(true);
      setDragStart(() => ({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }));
    },
    [position],
  );

  React.useEffect(() => {
    if (!isDragging) {
      return;
    }
    function handleDrag(e: MouseEvent) {
      console.log("drag");
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    function handleDragEnd(e: MouseEvent) {
      document.removeEventListener("mousemove", handleDrag);
      setIsDragging(false);
    }

    console.log("add event listener");
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  return {
    position,
    handleMouseDown,
    isDragging,
  };
}

interface MouseEventHandler<T extends Element> {
  (event: MouseEvent): void;
  (event: React.MouseEvent<T>): void;
}
