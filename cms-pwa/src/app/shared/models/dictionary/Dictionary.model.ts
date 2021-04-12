import { DictionaryElementModel } from './DictionaryElement.model';

export interface DictionaryModel {
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  dictionary?: DictionaryElementModel[];
  status?: string;
}
