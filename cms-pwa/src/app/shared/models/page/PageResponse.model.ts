import { PageModel } from './Page.model';

export interface PageResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: PageModel;
}
