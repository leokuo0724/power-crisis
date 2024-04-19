import { createEffect, type Component } from "solid-js";
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
    <div class="absolute" ref={ref}>
      <span class="absolute top-0 left-0"></span>
      <div class="absolute bottom-0 right-0"></div>
    </div>
  );
};
