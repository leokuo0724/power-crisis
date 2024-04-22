export type BuffNerfType = {
  type: string;
  operator: "-" | "+";
  value: number;
  desc: string;
};

export const PERMANENT_BUFFS: BuffNerfType[] = [
  {
    type: "currentPower",
    operator: "+",
    value: 5,
    desc: "Increase current power by 5",
  },
  {
    type: "targetPower",
    operator: "-",
    value: 3,
    desc: "Decrease target power by 3",
  },
  {
    type: "collectUnit.coal",
    operator: "+",
    value: 1,
    desc: "Increase coal collect unit by 1",
  },
  {
    type: "collectUnit.natural_gas",
    operator: "+",
    value: 1,
    desc: "Increase natural gas collect unit by 1",
  },
  {
    type: "collectUnit.oil",
    operator: "+",
    value: 1,
    desc: "Increase oil collect unit by 1",
  },
  {
    type: "collectUnit.uranium",
    operator: "+",
    value: 1,
    desc: "Increase uranium collect unit by 1",
  },
  {
    type: "resourceStorage.coal.max",
    operator: "+",
    value: 1,
    desc: "Increase coal max storage by 2",
  },
  {
    type: "resourceStorage.natural_gas.max",
    operator: "+",
    value: 1,
    desc: "Increase natural gas max storage by 2",
  },
  {
    type: "resourceStorage.oil.max",
    operator: "+",
    value: 1,
    desc: "Increase oil max storage by 2",
  },
  {
    type: "resourceStorage.uranium.max",
    operator: "+",
    value: 1,
    desc: "Increase uranium max storage by 1",
  },
  {
    type: "resourceStorage.biomass.max",
    operator: "+",
    value: 1,
    desc: "Increase biomass max storage by 1",
  },
];

export const PERMANENT_NERFS: BuffNerfType[] = [
  {
    type: "currentPower",
    operator: "-",
    value: 3,
    desc: "Decrease current power by 3",
  },
  {
    type: "targetPower",
    operator: "+",
    value: 2,
    desc: "Increase target power by 2",
  },
  {
    type: "costUnit.coal",
    operator: "+",
    value: 1,
    desc: "Increase coal collect cost by 1",
  },
  {
    type: "costUnit.natural_gas",
    operator: "+",
    value: 1,
    desc: "Increase natural gas collect cost by 1",
  },
  {
    type: "costUnit.oil",
    operator: "+",
    value: 1,
    desc: "Increase oil collect cost by 1",
  },
  {
    type: "costUnit.uranium",
    operator: "+",
    value: 1,
    desc: "Increase uranium collect cost by 1",
  },
  {
    type: "costUnit.biomass",
    operator: "+",
    value: 1,
    desc: "Increase biomass collect cost by 1",
  },
  {
    type: "resourceStorage.coal.max",
    operator: "-",
    value: 1,
    desc: "Decrease coal max storage by 1",
  },
  {
    type: "resourceStorage.natural_gas.max",
    operator: "-",
    value: 1,
    desc: "Decrease natural gas max storage by 1",
  },
  {
    type: "resourceStorage.oil.max",
    operator: "-",
    value: 1,
    desc: "Decrease oil max storage by 1",
  },
  {
    type: "resourceStorage.uranium.max",
    operator: "-",
    value: 1,
    desc: "Decrease uranium max storage by 1",
  },
  {
    type: "resourceStorage.biomass.max",
    operator: "-",
    value: 1,
    desc: "Decrease biomass max storage by 1",
  },
];
