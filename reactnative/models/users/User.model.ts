export interface UserModel {
    id?: string | number;
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    updatedAt?: string;
    roles?: string[];
    status?: string;
}
