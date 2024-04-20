import { createEffect, type Component } from "solid-js";
import { resizeCounter } from "./states/screen";

export const App: Component = () => {
  let topLeftRef: HTMLDivElement | undefined;
  let bottomRightRef: HTMLDivElement | undefined;

  const resizeApp = () => {
    const style = document.querySelector("canvas")?.style;
    if (!topLeftRef || !bottomRightRef || !style) return;

    topLeftRef.style.marginLeft = style.marginLeft;
    topLeftRef.style.marginTop = style.marginTop;
    bottomRightRef.style.marginBottom = style.marginTop;
    bottomRightRef.style.marginRight = style.marginLeft;
  };

  createEffect(() => {
    if (resizeCounter() > 0) resizeApp();
  });

  return (
    <>
      <div ref={topLeftRef} class="absolute top-0 left-0"></div>
      <div ref={bottomRightRef} class="absolute bottom-0 right-0 "></div>
    </>
  );
};
