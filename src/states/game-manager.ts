import { createStore } from "solid-js/store";

type GameManager = {
  round: number;
  currentTileIndex: number;
};

export const [gameManager, setGameManager] = createStore<GameManager>({
  round: 1,
  currentTileIndex: 0,
});
