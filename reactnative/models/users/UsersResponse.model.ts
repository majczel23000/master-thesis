import { UserModel } from "./User.model";

export interface UsersResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: UserModel[];
}
