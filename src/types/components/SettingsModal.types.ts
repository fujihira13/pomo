import { TimerSettings } from "../models/Settings";

export interface SettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
  task: { name: string };
}
