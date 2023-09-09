import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as moment from 'moment';
import 'moment-timezone';
import { GenericResponse } from 'src/domain/dto/generic';
import { Login, UpdateUserDto, User } from 'src/domain/user-auth/dto/user-type..dto';
import { AuthRepository } from 'src/domain/user-auth/interfaces/auth-repository.interface';
import { MailService } from '../mail/mail.service';
import { JsonService } from '../json/json.service';
import { NotFoundError } from 'rxjs';



/**
 * @export
 * @class UserAuthService
 */
@Injectable()
export class UserAuthService {


    /**
     * Creates an instance of UserAuthService.
     * @param {AuthRepository} userRepository
     * @memberof UserAuthService
     */
    constructor(
        @Inject('AuthRepository') private userRepository: AuthRepository,
        private mailService: MailService,
        private jsonService: JsonService
    ) { }


    public async update(user: UpdateUserDto): Promise<GenericResponse<null>> {
        let res = await this.userRepository.update(user);

        let response: GenericResponse<null> = {
            message: "User not updated",
            success: false,
            data: null,
        }

        if (res.modifiedCount == 1) {
            response = {
                message: "User updated successfully",
                success: true,
                data: null,
            };
        }

        return response;
    }


    public async activateUser(uid: string): Promise<GenericResponse<null>> {

        let userData: User = await this.userRepository.findById(uid);

        if (!userData) {
            return {
                message: "User not found",
                data: null,
                success: false
            }
        }

        const date = moment().tz("Asia/Riyadh").format();

        let newPassword = await this.userRepository.generatePassword();
        let hashPassword = await this.userRepository.hashPassword(newPassword);

        const data = {
            _id: uid,
            active: {
                status: true,
                reason: "NEW ACCOUNT",
                activationDate: date
            },
            password: hashPassword,
            "resetPassword.loginAttempts": 0,
            "resetPassword.status": true,
        };
        console.log('USER', userData);
        let res = await this.userRepository.update(data);
        let messages = await this.jsonService.parseJson('email-messages/email-messages.json');
        this.mailService.sendMail({
            subject: messages.activateUser.subject,
            template: 'email',
            context: {
                email: userData.email,
                password: newPassword,
                text: messages.activateUser.text,
                heading: messages.activateUser.heading,
            }, email: userData.email
        })

        let response: GenericResponse<null> = {
            message: "User not activated",
            success: false,
            data: null,
        }

        if (res.modifiedCount == 1) {
            response = {
                message: "User activated successfully",
                success: true,
                data: null,
            };
        }
        return response;
    }


    public async deactivateUser(uid: string, reason: string): Promise<GenericResponse<null>> {
        const data: any = {

            status: false,
            reason: reason
        }

        let res = await this.userRepository.update({ _id: uid, active: data });
        let response: GenericResponse<null> = {
            message: "User not deactivated",
            success: false,
            data: null,
        }

        if (res.modifiedCount == 1) {
            response = {
                message: "User deactivated successfully",
                success: true,
                data: null,
            };
        }
        return response;
    }


    public async undoDeactivate(uid: string): Promise<GenericResponse<null>> {
        const date = moment().tz("Asia/Riyadh").format();
        const data: any = {
            status: true,
            activationDate: date
        }

        let res = await this.userRepository.update({ _id: uid, active: data });
        let response: GenericResponse<null> = {
            message: "User not activated",
            success: false,
            data: null,
        }

        if (res.modifiedCount == 1) {
            response = {
                message: "User activated successfully",
                success: true,
                data: null,
            };
        }
        return response;
    }



    /**
     *
     * Signup user
     * @param {User} user
     * @return {*}  {Promise<any>}
     * @memberof UserAuthService
     */
    async create(user: User): Promise<any> {
        //Destructuring email form user Object
        const { email } = user;

        // check user exist
        const userExist = await this.userRepository.isUserExist(email);
        if (userExist) {
            throw new BadRequestException("User Already Exists");
        }

        let newPassword = await this.userRepository.generatePassword();
        let hashPassword = await this.userRepository.hashPassword(newPassword);

        //Saving Object as Data
        const data: User = user;

        data.password = hashPassword;

        // Setting initials for reset Password
        data.resetPassword = {
            status: true,
            loginAttempts: 0,
            lastPasswordReset: null
        }

        // Setting initials for browser
        data.browsers = {
            code: null,
            list: []
        }

        //creating user record
        await this.createUser(data);
        let messages = await this.jsonService.parseJson('email-messages/email-messages.json');
        //email handler 
        this.mailService.sendMail({
            subject: messages.signup.subject,
            template: 'email',
            context: {
                email: email,
                password: newPassword,
                text: messages.signup.text,
                heading: messages.signup.heading
            },
            email: email
        })

        // Generic Response
        const response: GenericResponse<null> = {
            success: true,
            message: "User Registered Successfully kindly Check Your Mail to get your credentials",
            data: null,
        };

        return response
    }

    async updatePassword(password: any, uid: any) {
        let pass = await this.userRepository.hashPassword(password);
        let user: User = await this.userRepository.findById(uid);
        user.resetPassword.status = false;
        user.resetPassword.lastPasswordReset = new Date().toDateString();
        user.resetPassword.loginAttempts = user.resetPassword.loginAttempts + 1;
        user.password = pass;
        let data = await this.userRepository.updateUser({ _id: uid }, user)
        let res: GenericResponse<null> = {
            message: "Password not updated",
            success: false,
            data: null
        }
        if (data.modifiedCount > 0) {
            res = {
                message: "User Registered Successfully kindly Check Your Mail to get your credentials",
                success: true,
                data: null
            };
        }
        return res;
    }


    public async signUp(user: User): Promise<GenericResponse<User>> {
        //Destructuring email form user Object
        const { email } = user;

        // check user exist
        const userExist = await this.userRepository.isUserExist(email);
        if (userExist) {
            throw new BadRequestException('User Already Exist');
        }

        //Saving Object as Data
        const data: User = user;

        //Saving reset Password Initials
        data.resetPassword = {
            status: true,
            loginAttempts: 0,
            lastPasswordReset: null
        }

        data.active = {
            status: false,
            reason: "NEW ACCOUNT",
            activationDate: new Date().toLocaleString(),
            activationCode: ''
        }

        //Saving Browser Initials
        data.browsers = {
            code: null,
            list: []
        }
        //creating user record
        this.createUser(data)
        let messages = await this.jsonService.parseJson('email-messages/email-messages.json');
        //email
        this.mailService.sendMail({
            subject: messages.createUser.subject,
            template: "welcome",
            context: {
                email: email,
                // password: password,
                text: messages.createUser.text,
                heading: messages.createUser.heading,
            },
            email: email
        })

        // Generic Response
        const response: GenericResponse<User> = {
            success: true,
            message: "User Registered Successfully we will send you a mail after the approval",
            data: data,
        };

        return response
    }

    // /**
    //  *
    //  * Register User
    //  * @param {User} user
    //  * @return {*}  {Promise<any>}
    //  * @memberof UserAuthService
    //  */
    // async register(user: User): Promise<any> {

    //     //Destructuring email form user Object
    //     const { email } = user;

    //     // check user exist
    //     const userExist = await this.userRepository.isUserExist(email);
    //     if (userExist) {
    //         throw new BadRequestException('User Already Exist');
    //     }

    //     //Saving Object as Data
    //     const data: User = user;

    //     //generating random password
    //     const password = await this.userRepository.generatePassword()


    //     //hash password
    //     const hashPassword = await this.userRepository.hashPassword(password)
    //     if (!hashPassword) {
    //         throw new Error("Password not hashed");
    //     }

    //     // Saving Hash Passwords 
    //     data.password = hashPassword

    //     //Saving reset Password Initials
    //     data.resetPassword = {
    //         status: true,
    //         loginAttempts: 0,
    //         lastPasswordReset: null
    //     }

    //     //Saving Browser Initials
    //     data.browsers = {
    //         code: null,
    //         list: []
    //     }
    //     //creating user record
    //     this.createUser(data)

    //     //email
    //     const messages = await this.jsonService.parseJson('email-messages/email-messages.json')
    //     this.mailService.sendMail({
    //         subject: messages.createUser.subject,
    //         template: "welcome",
    //         context: {
    //             email: email,
    //             // password: password,
    //             text: messages.createUser.text,
    //             heading: messages.createUser.heading,
    //         },
    //         email: email
    //     })

    //     // Generic Response
    //     const response: GenericResponse<User> = {
    //         success: true,
    //         message: "User Registered Successfully kindly Check Your Mail to get your credentials",
    //         data: data,
    //     };

    //     return response

    // }


    /**
     *
     *  Login User
     * @param {Login} login
     * @param {*} userAgent
     * @return {*}  {Promise<any>}
     * @memberof UserAuthService
     */
    async login(login: Login, userAgent: any): Promise<any> {

        const { email, password, otp } = login;

        // check user exist
        const userExist = await this.userRepository.isUserExist(email);
        if (!userExist) {
            throw new BadRequestException("User Doesn't Exist");
        }

        //validating the password
        const isPasswordValid = await this.userRepository.validatePassword(email, password);

        //Fetching the user Data
        let fields = ["_id", "role", "name", "active", "resetPassword", "ministries", "browsers", "email", "phone", "gender", "national_id", "image"]
        const uid = await this.userRepository.findOne({ email: email }, fields);
        if (!uid) {
            throw new Error("User Data Not Received");
        }


        if (!uid.active.status) {
            throw new UnauthorizedException("User not activated, please contact administrator");
        }

        //Handling Invalid Password 
        if (!isPasswordValid) {

            //If login Attempts are equal to 10
            if (uid.resetPassword.loginAttempts > 8) {

                const password = await this.userRepository.generatePassword()

                let data = {
                    "active.activationCode": password,
                    "active.reason": "Due to multiple invalid Password reasons",
                    'active.status': false,
                    'resetPassword.status': true
                }
                const user = await this.userRepository.updateUser({ email: email }, data);
                if (user.modifiedCount === 0) {
                    throw new HttpException("User data not updated", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                //email
                this.mailService.sendMail({
                    subject: "تم إيقاف حسابك في بوابة المعرفة",
                    template: 'accountdeactive',
                    context: {
                        email: email,
                        key: password,
                        text: `تم إيقاف حسابك في بوابة المعرفة بسبب عدد محاولات تسجيل الدخول الفاشلة.
              لتفعيل حسابك اضغط على الرابط أدناه
              `,
                        heading: "!مرحباً",
                        link: `https://http://10.20.34.17/account/activate?id=${uid._id}&key=${password}`
                    },
                    email: email
                })
            }
            else {
                //If not validate password update password Count
                const updateCount = await this.userRepository.incrementLoginAttempts(email);
                if (!updateCount) {
                    throw new Error("User data not updated")
                }
            }

            throw new UnauthorizedException("البريد الإلكتروني أو كلمة السر خاطئة", "INVALID_CREDENTIALS");
        }

        //creating JWT Token
        const tokens = await this.userRepository.createJwtTokens(email, uid._id);
        const data: any = {
            accessToken: tokens.accessToken,
        };

        if (!uid.browsers.list.includes(userAgent)) {
            //If OTP
            if (otp) {
                uid.browsers.list.push(userAgent)
                if (uid.browsers.code == otp) {
                    data.browsers = {
                        code: null,
                        list: uid.browsers.list
                    }
                } else throw new BadRequestException("Invalid OTP");
            }
            else if (!otp || otp == null) {
                //generating new OTP
                const OTP = await this.userRepository.generatePassword()
                //creating browser object to update the record
                data.browsers = {
                    code: OTP,
                    list: uid.browsers.list
                }
                // email
                this.mailService.sendMail({
                    subject: "استخدم كلمة المرور الصالحة لمرة واحدة (OTP) لتسجيل الدخول",
                    template: 'browserotp',
                    context: {
                        email: email,
                        key: OTP,
                        text: 'لقد قمت بتسجيل الدخول من متصفح جديد، يرجى استخدام كلمة المرور الصالحة لمرة واحدة (OTP) لتسجيل الدخول',
                        heading: "!مرحباً",
                    },
                    email: email
                })

                delete data.accessToken
                delete data.loginAttempts
                //updating user data
                const isUpdated = await this.userRepository.updateUser({ email: email }, data);
                if (isUpdated.modifiedCount === 0) {
                    throw new HttpException("User not updated", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                throw new NotAcceptableException("New Browser Detected");
            }
        }

        //update access token
        const isUpdated = await this.userRepository.updateUser({ email: email }, data);
        if (isUpdated.modifiedCount === 0) {
            throw new HttpException("Failed to update user", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        //constructing login response
        const response: GenericResponse<any> = {
            success: true,
            message: "Login Successfully",
            data: {
                ...tokens,
                success: true,
                message: "Login Successfully",
                role: uid.role,
                username: uid.name,
                resetPassword: uid.resetPassword,
                id: uid._id,
                ministries: uid.ministries,
                image: uid.image,
                email: uid.email,
                phone: uid.phone,
                gender: uid.gender,
                national_id: uid.national_id
            },
        };

        return response;

    }


    /**
     *
     * Get all users
     * @return {*}  {Promise<User[]>}
     * @memberof UserAuthService
     */
    async getUsers(): Promise<any> {
        let data: User[] = await this.userRepository.findAll();

        // Generic Response
        const response: GenericResponse<User[]> = {
            success: true,
            message: "Users fetched Successfully",
            data: data,
        };

        return response
    }


    /**
     *
     *  get user by ID
     * @param {string} id
     * @return {*}  {Promise<User>}
     * @memberof UserAuthService
     */
    async getUserById(id: string): Promise<any> {

        let data: User = await this.userRepository.findById(id);

        // Generic Response
        const response: GenericResponse<User> = {
            success: true,
            message: "User data fetched Successfully",
            data: data,
        };

        return response
    }

    public async updateProfile(url: string, uid: string) {
        //update accesstoken
        const isUpdated = await this.userRepository.updateUser(
            { _id: uid },
            { image: url }
        );
        if (isUpdated.modifiedCount === 0) {
            throw new HttpException("Failed to update profile", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     *
     * Create user
     * @param {User} user
     * @return {*}  {Promise<User>}
     * @memberof UserAuthService
     */
    async createUser(user: User): Promise<any> {

        let data: User = await this.userRepository.create(user);

        // Generic Response
        const response: GenericResponse<User> = {
            success: true,
            message: "User created Successfully",
            data: data,
        };

        return response
    }


    public async forgotPassword(email: string):Promise<GenericResponse<null>> {

        //validating the email
        const userExist = await this.userRepository.isUserExist(email);
        if (!userExist) {
            throw new HttpException("User Not Found",HttpStatus.NOT_FOUND);
        }

        //generating random password
        const password = await this.userRepository.generatePassword();
        if (!password) {
            throw new HttpException("Partial Service Outage",HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // hash password
        const hashPassword = await this.userRepository.hashPassword(password);
        if (!hashPassword) {
            throw new HttpException("Partial Service Outage",HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const data = {
            password: hashPassword,
            "resetPassword.status": true
        }

        //update query
        const isUpdated = await this.userRepository.updateUser(
            { email: email },
            data
        );
        if (isUpdated.modifiedCount == 0) {
            throw new HttpException("Service Unavailable",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this.mailService.sendMail({
            subject: "إعادة تعيين كلمة المرور",
            template: "email",
            context: {
                email: email,
                password: password,
                text: `لقد وصلك هذا البريد الإلكتروني لأنك طلبت إعادة تعيين كلمة المرورالخاصة بك،
                أدناه معلومات تسجيل الدخول:
                `,
                heading: "! مرحباً",
            },
            email: email
        });
        const res:GenericResponse<null> = {
            message:"يرجى التحقق من بريدك الإلكتروني للحصول على كلمة مرور جديدة",
            success:true,
            data:null
        }
        return res;
    }
}
