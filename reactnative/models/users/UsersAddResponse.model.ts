import { UserModel } from "./User.model";

export interface UsersAddResponseModel {
    status?: string;
    code?: string;
    message?: string;
    data?: UserModel;
}
