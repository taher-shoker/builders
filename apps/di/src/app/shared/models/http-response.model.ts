// Level 0 models :

export interface LevelZeroResponse {
  data: {
    BUs: BusinessName[];
    FUs: BusinessName[];
    Overall: BusinessName[];
    Technology: BusinessName[];
  };
}

export interface BusinessName {
  achievedFlag: AchievedFlag;
  dimension: Dimension;
  unitSectorGroup: UnitSectorGroup;
  frequencyType: FrequencyType;
  frequencyNum: number;
  monthDiff: number;
  score: number;
  target: number;
  yearNum: number;
}

// Level one models :

export interface LevelOneResponse {
  trends: {
    additionalProp1: AdditionalPropTrend[];
    additionalProp2: AdditionalPropTrend[];
    additionalProp3: AdditionalPropTrend[];
  };

  scores: {
    additionalProp1: AdditionalPropScore[];
    additionalProp2: AdditionalPropScore[];
    additionalProp3: AdditionalPropScore[];
  };
}

interface BaseAdditionalProp {
  yearNum: number;
  frequencyNum: number;
  frequencyType: FrequencyType;
  unitSectorGroup: UnitSectorGroup;
  unitSector: string;
  score: number;
  target: number;
}

export interface AdditionalPropScore extends BaseAdditionalProp {
  dimension: Dimension;
  aboveTarget: number;
  achievedFlag: AchievedFlag;
  monthDiff: number;
  lastUpdate: string;
}

export interface AdditionalPropTrend extends BaseAdditionalProp {
  baseline: 0;
}

// Level 2 models :

export interface LevelTwoResponse {
  kpiCount: KpisCount;
  data: KpiItem[];
}

export interface KpisCount {
  yearNum?: number | undefined;
  frequencyNum?: number | undefined;
  frequencyType?: FrequencyType | undefined;
  unitSectorGroup?: UnitSectorGroup | undefined;
  totalKpis?: number | undefined;
  achievedKpis?: number | undefined;
  overAchievedKpis?: number | undefined;
  onTrackKpis?: number | undefined;
  lagBehindKpis?: number | undefined;
  riskKpis?: number | undefined;
}

export interface KpiItem {
  yearNum: number;
  frequencyNum: number;
  frequencyType: FrequencyType;
  unitSectorGroup: UnitSectorGroup;
  dimension: Dimension;
  objectiveTwo: string;
  objectiveThree: string;
  unit: string;
  kpiName: string;
  kpiId: string;
  kpiDirection: number;
  status: number;
  achievedFlag: AchievedFlag;
  actualValue: number;
  diffFromLastMonth: number;
  target: number;
}

export interface KpiDetailsResponse{
  data: KpiDetails[]
}
export interface KpiDetails {
  actualValue: number;
  baseline: number;
  custodian: string;
  definition: string;
  frequencyNum: number;
  frequencyType: FrequencyType;
  goal: null;
  kpiDirection: number;
  kpiId: string;
  kpiName: string;
  lastUpdate: null;
  method: null;
  objective: null;
  owner: string;
  sponsor: null;
  target: number;
  unitSector: string;
  unitSectorGroup: UnitSectorGroup;
  validationAuth: string;
  weight: null;
  yeScoring: null;
  yearNum: number;
}

// Known & shared types :

type FrequencyType = 'M' | 'W';
type Dimension =
  | 'Overall'
  | 'Capability Building'
  | 'Capability Utilization'
  | 'Digital Experience & Impact';
type UnitSectorGroup = 'BUs' | 'FUs' | 'Technology' | 'Overall';
type AchievedFlag = '1' | '0';
