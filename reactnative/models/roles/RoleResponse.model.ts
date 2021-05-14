import { RoleModel } from "./Role.model";

export interface RoleResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: RoleModel;
}
