import { SettingModel } from './Setting.model';

export interface SettingsListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: SettingModel[];
}
