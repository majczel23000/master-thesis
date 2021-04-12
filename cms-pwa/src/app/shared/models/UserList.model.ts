import { User } from './user.model';

export interface UserListModel {
    code: number;
    status: boolean;
    message: string;
    data: User[];
}
