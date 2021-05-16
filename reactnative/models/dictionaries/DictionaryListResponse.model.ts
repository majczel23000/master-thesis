import { DictionaryModel } from "./Dictionary.model";

export interface DictionaryListResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: DictionaryModel[];
}
