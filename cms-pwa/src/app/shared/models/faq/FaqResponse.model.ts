import { FaqModel } from './Faq.model';

export interface FaqResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: FaqModel;
}
