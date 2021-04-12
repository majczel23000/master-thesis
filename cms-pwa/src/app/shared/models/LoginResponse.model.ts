import { User } from './user.model';

export interface LoginResponseModel {
    code: number;
    status: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}
