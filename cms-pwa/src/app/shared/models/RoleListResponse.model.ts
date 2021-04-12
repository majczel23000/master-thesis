import { RoleModel } from './Role.model';

export interface RoleListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: RoleModel[];
}
