import { MenuElementModel } from './MenuElement.model';

export interface MenuModel {
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: string;
  elements?: MenuElementModel[];
}
