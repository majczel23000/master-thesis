import { DictionaryModel } from './Dictionary.model';

export interface DictionaryListResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: DictionaryModel[];
}
