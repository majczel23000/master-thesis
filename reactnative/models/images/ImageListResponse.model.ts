import { ImageModel } from "./Image.model";

export interface ImageResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: ImageModel[];
}
