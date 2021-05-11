import { UserModel } from "./users/User.model";

export interface LoginResponseModel {
    code?: string;
    data?: {
        token: string;
        user: UserModel;
    }
    status?: string;
    message?: string;
}
