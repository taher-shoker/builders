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

export type LevelOneResponse  = TrendCard[]

export interface TrendCard {
  trends: Trend[],
  scores: Score[]
}

interface BaseTrendCard {
  yearNum: number;
  frequencyNum: number;
  frequencyType: FrequencyType;
  unitSectorGroup: UnitSectorGroup;
  unitSector: string;
  score: number;
  target: number;
}

export interface Score extends BaseTrendCard {
  dimension: Dimension;
  aboveTarget: number;
  achievedFlag: AchievedFlag;
  monthDiff: number;
  lastUpdate: string;
}

export interface Trend extends BaseTrendCard {
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
  date: Date;
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
  kpiDirection: 0 | 1 | -1;
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

// Filters level 2 Response :

export interface Filters {
  kpi_dimension: string[],
  objective_level_2: string[],
  objective_level_3: string[],
  unit: string[]
}

// Known & shared types :

type FrequencyType = 'M' | 'W';
export type Dimension =
  | 'Overall'
  | 'Capability Building'
  | 'Capability Utilization'
  | 'Digital Experience & Impact';
export type UnitSectorGroup = 'BUs' | 'FUs' | 'Technology' | 'Overall';
export type AchievedFlag = '1' | '0';
