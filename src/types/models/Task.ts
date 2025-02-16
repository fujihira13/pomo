import { IconName } from "./IconName";

export interface Experience {
  current: number;
  max: number;
}

export interface Skill {
  name: string;
}

export interface Job {
  type: string;
  bonus: string;
}

export interface Task {
  id: string;
  name: string;
  icon: IconName;
  level: number;
  experience: Experience;
  skills: Skill[];
  job: Job;
}
