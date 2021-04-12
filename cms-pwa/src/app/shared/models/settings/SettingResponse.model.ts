import { SettingModel } from './Setting.model';

export interface SettingResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: SettingModel;
}
