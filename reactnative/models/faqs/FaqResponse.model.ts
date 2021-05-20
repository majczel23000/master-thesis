import { FaqModel } from "./Faq.model";

export interface FaqResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: FaqModel;
}
