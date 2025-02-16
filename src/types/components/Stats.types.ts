export interface StatsProps {
  onBack: () => void;
}

export type PeriodType = "day" | "week" | "month" | "year";

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}
