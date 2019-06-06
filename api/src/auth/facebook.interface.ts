import { User } from '../users/user.entity';

export interface IFacebookLogin {
  email?: string;
  existing?: boolean;
  name?: string;
  user?: User;
}
