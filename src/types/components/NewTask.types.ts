export interface NewTaskProps {
  onClose: () => void;
  onSave: (taskName: string, taskType: string, jobType: string) => void;
}

export interface JobOption {
  type: string;
  name: string;
  icon: string;
  description: string;
  bonus: string;
  tags: string[];
}
