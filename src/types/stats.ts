export interface Session {
  id: string;
  taskId: string;
  timestamp: number;
  duration: number;
  taskType: string;
  experiencePoints: number;
}

export interface DailyStats {
  date: string;
  sessionCount: number;
  totalDuration: number;
  experiencePoints: number;
}

export interface TaskDistribution {
  taskType: string;
  taskId: string;
  sessionCount: number;
}

export interface Stats {
  dailyStats: DailyStats[];
  taskDistribution: TaskDistribution[];
  streakDays: number;
  totalExperience: number;
}
