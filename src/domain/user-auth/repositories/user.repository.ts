import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";
import { UpdateUserDto, User } from "../dto/user-type..dto";
import { AuthRepository } from "../interfaces/auth-repository.interface";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { Permission } from "src/domain/permission/dto/permission.dto";

let refreshTokenList = []
exports.refreshTokenList = refreshTokenList;

/**
 * @export
 * @class UserRepository
 * @implements {AuthRepository}
 */
@Injectable()
export class UserRepositoryImpl implements AuthRepository {
    /**
     * Creates an instance of UserRepository.
     * @param {Model<User>} userModel
     * @param {JwtService} jwtService
     * @memberof UserRepository
     */
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private jwtService: JwtService
    ) { }


    update(data: any): Promise<UpdateWriteOpResult> {
        let { _id } = data;
        delete data._id;
        return this.userModel.updateOne({ _id: _id }, { $set: data });
    }

    //User Exist Check
    async isUserExist(email) {
        try {
            const isExist = await this.userModel.exists({ email: email })
            return isExist;
        } catch (error) {
            return false;
        }
    }

    //Generate Password
    async generatePassword() {
        try {
            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        } catch (error) {
            return false;
        }
    }

    //hash Password
    async hashPassword(password: string) {
        try {
            const salt = await bcrypt.genSalt(10);
            const HashPassword = await bcrypt.hash(password, salt);
            return HashPassword;
        } catch (error) {
            return null;
        }
    }

    // Validating the credentials of the user
    async validatePassword(email: string, userPassword: string): Promise<Boolean> {
        try {
            const { password } = await this.userModel.findOne({ email: email }, "password");
            const isMatch = await bcrypt.compare(userPassword, password);
            return isMatch;
        } catch (error) {
            return false;
        }
    }

    //creating JWT Toke
    async createJwtTokens(email: string, uid: string): Promise<any> {
        const userData = {
            date: Date.now(),
            uid: uid,
            email: email
        }
        const accessToken = await this.jwtService.signAsync(userData, { expiresIn: process.env.TOKEN_EXPIRY, secret: process.env.ACCESS_TOKEN_SECRET });
        const refreshToken = await this.jwtService.signAsync(userData, { secret: process.env.REFRESH_TOKEN_SECRET });
        refreshTokenList.push(refreshToken);
        return { refreshToken: refreshToken, accessToken: accessToken };
    }

    // Find record of the user provide by filters and selects the keys that are present i the filds array
    async findOne(filter: Record<string, any>, fields: Array<string>): Promise<User> {
        try {
            return this.userModel.findOne(filter, fields)
                .populate({
                    path: "role",
                    populate: {
                        path: "permissions",
                        populate: {
                            path: "permissions.ou"
                        }
                    },
                });
        } catch (error) {
            return null
        }
    }

    //Incrementing Login Attempts
    async incrementLoginAttempts(email: string): Promise<any> {
        return this.userModel.updateOne({ email: email },
            { $inc: { 'resetPassword.loginAttempts': 1 } }
        )
    }

    //Update User Record
    async updateUser(filter: Record<string, any>, data: any): Promise<UpdateWriteOpResult> {
        return this.userModel.updateOne(filter, { $set: data })
    }

    // find all users
    async findAll(): Promise<User[]> {
        return this.userModel.find()
            .populate('role')
            .populate('location')
            .populate('ou');
    }

    //find user by Id
    async findById(id: string): Promise<User> {
        return this.userModel.findById(id)
            .populate('role')
            .populate('location')
            .populate('ou');
    }

    //create user
    async create(user: User): Promise<User> {
        return this.userModel.create(user);
    }
}