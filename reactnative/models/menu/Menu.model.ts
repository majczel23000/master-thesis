import { MenuElementModel } from './MenuElement.model';

export interface MenuModel {
  _id?: string;
  code?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: string;
  elements?: MenuElementModel[];
}
