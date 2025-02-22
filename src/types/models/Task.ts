import type { IconName } from "./IconName";

export interface Experience {
  current: number;
  max: number;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Job {
  type: string;
  bonus: string;
  icon: IconName;
}

export interface Task {
  id: string;
  name: string;
  icon: IconName;
  level: number;
  experience: Experience;
  skills: Skill[];
  job: Job;
  taskType?: string;
  jobType?: string;
}
