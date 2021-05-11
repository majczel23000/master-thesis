import { RoleModel } from "./Role.model";

export interface RolesResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: RoleModel[];
}
