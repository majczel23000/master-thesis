import { DictionaryModel } from "./Dictionary.model";

export interface DictionaryResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: DictionaryModel;
}
