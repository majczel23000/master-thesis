import { FaqModel } from './Faq.model';

export interface FaqListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: FaqModel[];
}
