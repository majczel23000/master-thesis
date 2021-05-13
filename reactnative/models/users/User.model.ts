export interface UserModel {
    _id?: string | number;
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
    roles?: string[];
    status?: string;
    password?: string;
}
