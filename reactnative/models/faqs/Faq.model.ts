import { FaqElementModel } from "./FaqElement.model";

export interface FaqModel {
    _id?: string;
    code?: string;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    elements?: FaqElementModel[];
    status?: string;
}
