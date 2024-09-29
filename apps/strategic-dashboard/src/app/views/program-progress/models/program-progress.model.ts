export interface ProgramProgress {
  programName: string;
  barData: {
    prefixText: string;
    prefixValue: number;
    suffixText: string;
    suffixValue: number;
    progressValue: number;
    indexes: {
      caption: string;
      value: number;
      position: 'up' | 'down';
    }[];
    barColor: string;
    bgBarColor: string;
  };
}
