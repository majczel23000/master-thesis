import { User } from './user.model';

export interface UserResponseModel {
  code: number;
  status: boolean;
  message: string;
  data: User;
}
