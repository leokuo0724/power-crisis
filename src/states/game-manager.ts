import { createStore } from "solid-js/store";
import { ResourceMetadata } from "~/sprites/tiles/resource-tile";
import { ConsumableResource } from "~/types/resource";

type GameManager = {
  round: number;
  currentTileIndex: number;
  currentTileResourceMetadata: ResourceMetadata | null;
  costUnit: Record<ConsumableResource, number>;
  collectUnit: Record<ConsumableResource, number>;
  resourceStorage: Record<ConsumableResource, { current: number; max: number }>;
  isNextRollEnabled: boolean;
};

export const [gameManager, setGameManager] = createStore<GameManager>({
  round: 1,
  currentTileIndex: 0,
  currentTileResourceMetadata: null,
  costUnit: {
    coal: 1,
    natural_gas: 1,
    oil: 1,
    uranium: 1,
    biomass: 0,
  },
  collectUnit: {
    coal: 1,
    natural_gas: 1,
    oil: 1,
    uranium: 1,
    biomass: Infinity,
  },
  resourceStorage: {
    coal: { current: 0, max: 5 },
    natural_gas: { current: 0, max: 5 },
    oil: { current: 0, max: 5 },
    uranium: { current: 0, max: 3 },
    biomass: { current: 0, max: 3 },
  },
  isNextRollEnabled: true,
});
