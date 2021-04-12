import { PageModel } from './Page.model';

export interface PageListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: PageModel[];
}
