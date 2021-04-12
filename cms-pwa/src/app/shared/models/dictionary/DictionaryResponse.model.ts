import { DictionaryModel } from './Dictionary.model';

export interface DictionaryResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: DictionaryModel;
}
