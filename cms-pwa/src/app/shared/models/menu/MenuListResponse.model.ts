import { MenuModel } from './Menu.model';

export interface MenuListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: MenuModel[];
}
