import { createEffect, type Component } from "solid-js";
import { counter, setCounter } from "./states/counter";
import { resizeCounter } from "./states/screen";

export const App: Component = () => {
  let ref: HTMLDivElement | undefined;

  const resizeApp = () => {
    const style = document.querySelector("canvas")?.style;
    if (!ref || !style) return;

    ref.style.width = style.width;
    ref.style.height = style.height;
    ref.style.marginLeft = style.marginLeft;
    ref.style.marginTop = style.marginTop;
  };

  createEffect(() => {
    if (resizeCounter() > 0) resizeApp();
  });

  return (
    <div ref={ref}>
      <span>{counter()}</span>
      <button onclick={() => setCounter((prev) => prev + 1)}>Click</button>
    </div>
  );
};
