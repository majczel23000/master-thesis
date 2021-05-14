import { ImageModel } from "./Image.model";
import {RoleModel} from "../roles/Role.model";

export interface ImageResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: RoleModel;
}
