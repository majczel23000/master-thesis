import { MenuModel } from './Menu.model';

export interface MenuResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: MenuModel;
}
