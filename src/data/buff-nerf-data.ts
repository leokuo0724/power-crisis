import { BuffNerfType } from "~/types/effects";

export const PERMANENT_BUFFS: BuffNerfType[] = [
  {
    type: "currentPower",
    operator: "+",
    value: 5,
    desc: "Current power",
  },
  {
    type: "targetPower",
    operator: "-",
    value: 3,
    desc: "Target power",
  },
  {
    type: "collectUnit.coal",
    operator: "+",
    value: 1,
    desc: "Coal collect unit",
  },
  {
    type: "collectUnit.natural_gas",
    operator: "+",
    value: 1,
    desc: "Natural gas collect unit",
  },
  {
    type: "collectUnit.oil",
    operator: "+",
    value: 1,
    desc: "Oil collect unit",
  },
  {
    type: "collectUnit.uranium",
    operator: "+",
    value: 1,
    desc: "Uranium collect unit",
  },
  {
    type: "resourceStorage.coal.max",
    operator: "+",
    value: 1,
    desc: "Coal max storage",
  },
  {
    type: "resourceStorage.natural_gas.max",
    operator: "+",
    value: 1,
    desc: "Natural gas max storage",
  },
  {
    type: "resourceStorage.oil.max",
    operator: "+",
    value: 1,
    desc: "Oil max storage",
  },
  {
    type: "resourceStorage.uranium.max",
    operator: "+",
    value: 1,
    desc: "Uranium max storage",
  },
  {
    type: "resourceStorage.biomass.max",
    operator: "+",
    value: 1,
    desc: "Biomass max storage",
  },
];

export const PERMANENT_NERFS: BuffNerfType[] = [
  {
    type: "currentPower",
    operator: "-",
    value: 3,
    desc: "Current power",
  },
  {
    type: "targetPower",
    operator: "+",
    value: 2,
    desc: "Target power",
  },
  {
    type: "costUnit.coal",
    operator: "+",
    value: 1,
    desc: "Coal collect cost",
  },
  {
    type: "costUnit.natural_gas",
    operator: "+",
    value: 1,
    desc: "Natural gas collect cost",
  },
  {
    type: "costUnit.oil",
    operator: "+",
    value: 1,
    desc: "Oil collect cost",
  },
  {
    type: "costUnit.uranium",
    operator: "+",
    value: 1,
    desc: "Uranium collect cost",
  },
  {
    type: "costUnit.biomass",
    operator: "+",
    value: 1,
    desc: "Biomass collect cost",
  },
  {
    type: "resourceStorage.coal.max",
    operator: "-",
    value: 1,
    desc: "Coal max storage",
  },
  {
    type: "resourceStorage.natural_gas.max",
    operator: "-",
    value: 1,
    desc: "Natural gas max storage",
  },
  {
    type: "resourceStorage.oil.max",
    operator: "-",
    value: 1,
    desc: "Oil max storage",
  },
  {
    type: "resourceStorage.uranium.max",
    operator: "-",
    value: 1,
    desc: "Uranium max storage",
  },
  {
    type: "resourceStorage.biomass.max",
    operator: "-",
    value: 1,
    desc: "Biomass max storage",
  },
];
