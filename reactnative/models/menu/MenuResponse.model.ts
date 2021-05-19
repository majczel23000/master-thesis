import { MenuModel } from './Menu.model';

export interface MenuResponseModel {
  code?: string;
  status?: boolean;
  message?: string;
  data?: MenuModel;
}
