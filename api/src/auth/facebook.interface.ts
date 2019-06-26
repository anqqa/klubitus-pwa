import { User } from '../users/user.entity';

export interface IFacebookLogin {
  connected?: boolean;
  email?: string;
  is_new_user?: boolean;
  name?: string;
  user?: User;
}
