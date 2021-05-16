import { SettingModel } from "./Setting.model";

export interface SettingResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: SettingModel;
}
