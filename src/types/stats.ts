export interface Session {
  id: string;
  taskId: string;
  taskType: string;
  timestamp: number;
  duration: number;
  experiencePoints: number;
}

export interface DailyStats {
  date: string;
  sessionCount: number;
  totalDuration: number;
  experiencePoints: number;
}

export interface TaskDistribution {
  taskId: string;
  taskType: string;
  sessionCount: number;
}

export interface Stats {
  dailyStats: DailyStats[];
  taskDistribution: TaskDistribution[];
  streakDays: number;
  totalExperience: number;
}
