
export interface LevelZeroResponse {
  data : {
    BUs : BusinessName[],
    FUs : BusinessName[],
    Overall : BusinessName[],
    Technology : BusinessName[],
  }
}


export interface BusinessName {
  achievedFlag: "0" | "1",
  dimension: "Overall"| "Capability Building" | "Capability Utilization" | "Digital Experience & Impact",
  unitSectorGroup: "BUs" | "FUs" | "Technology" | "Overall",
  frequencyType: "M" | "W",
  frequencyNum: number,
  monthDiff: number,
  score: number,
  target: number,
  yearNum: number
}

export interface LevelOneResponse {
  trends: {
    additionalProp1: AdditionalPropTrend[],
    additionalProp2: AdditionalPropTrend[],
    additionalProp3: AdditionalPropTrend[]
  },

  scores: {
    additionalProp1: AdditionalPropScore[],
    additionalProp2: AdditionalPropScore[],
    additionalProp3: AdditionalPropScore[]
  }
}


interface BaseAdditionalProp {
  yearNum: number,
  frequencyNum: number,
  frequencyType: string,
  unitSectorGroup: string,
  unitSector: string,
  score: number,
  target: number,
}

export interface AdditionalPropScore extends BaseAdditionalProp {
  dimension: string,
  aboveTarget: number,
  achievedFlag: string,
  monthDiff: number,
  lastUpdate: string
}

export interface AdditionalPropTrend extends BaseAdditionalProp {
  baseline: 0
}
