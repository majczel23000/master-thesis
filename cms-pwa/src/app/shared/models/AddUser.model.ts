import { User } from './user.model';

export interface AddUserModel {
    code: number;
    status: boolean;
    message: string;
    data: User;
}
