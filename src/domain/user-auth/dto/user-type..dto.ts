import { IntersectionType } from '@nestjs/swagger';
import { Schema } from 'mongoose';

/**
 * @export
 * @class User
 * @extends {Document}
 */
export class User {
  name: Object;
  email: string;
  password: string;
  image: string;
  phone: string;
  national_id: string;
  gender: string;
  ou: Array<Schema.Types.ObjectId>
  location: Schema.Types.ObjectId;
  position: Schema.Types.ObjectId;
  role: Schema.Types.ObjectId;
  browsers: Browser
  accessToken: string
  resetPassword: ResetPassword
  active: Active
}

export class UpdateUserDto extends IntersectionType(User) {
  _id: string;
}


/**
 * @export
 * @class Active
 */

export class Active {
  status: boolean
  activationCode: string
  reason: string
  activationDate: string
}

/**
 * @export
 * @class ResetPassword
 */
export class ResetPassword {
  status: Boolean;
  loginAttempts: number;
  lastPasswordReset: string;
}

/**
 * @export
 * @class Browser
 */
export class Browser {
  code: string
  list: Array<string>
}

/**
 * @export
 * @class Login
 */
export class Login {
  email: string
  password: string
  otp?: string
}
