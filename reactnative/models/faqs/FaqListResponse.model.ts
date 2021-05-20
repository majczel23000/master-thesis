import { FaqModel } from "./Faq.model";

export interface FaqListResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: FaqModel[];
}
