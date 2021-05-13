import { UserModel } from "./User.model";

export interface UserResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: UserModel;
}
