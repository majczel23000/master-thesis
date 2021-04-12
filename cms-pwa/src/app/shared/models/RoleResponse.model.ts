import { RoleModel } from './Role.model';

export interface RoleResponseModel {
    code: number;
    status: boolean;
    message: string;
    data: RoleModel;
}
