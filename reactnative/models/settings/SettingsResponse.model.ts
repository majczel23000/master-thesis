import { SettingModel } from "./Setting.model";

export interface SettingsResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: SettingModel[];
}
