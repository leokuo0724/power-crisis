import { createStore } from "solid-js/store";
import { ResourceMetadata } from "~/sprites/tiles/resource-tile";

type GameManager = {
  round: number;
  currentTileIndex: number;
  currentTileResourceMetadata: ResourceMetadata | null;
};

export const [gameManager, setGameManager] = createStore<GameManager>({
  round: 1,
  currentTileIndex: 0,
  currentTileResourceMetadata: null,
});
