import { DictionaryElementModel } from "./DictionaryElement.model";

export interface DictionaryModel {
    _id?: string;
    code?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    dictionary?: DictionaryElementModel[];
    status?: string;
}
