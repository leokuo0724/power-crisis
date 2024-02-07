import { type Component } from "solid-js";
import { counter, setCounter } from "./states/counter";

export const App: Component = () => {
  return (
    <div>
      <span>{counter()}</span>
      <button onclick={() => setCounter((prev) => prev + 1)}>Click</button>
    </div>
  );
};
