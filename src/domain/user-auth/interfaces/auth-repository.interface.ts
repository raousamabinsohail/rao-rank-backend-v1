import { UpdateWriteOpResult } from "mongoose";
import { UpdateUserDto, User } from "../dto/user-type..dto";
import { Permission } from "src/domain/permission/dto/permission.dto";

/**
 * @export
 * @interface AuthRepository
 */
export interface AuthRepository{
    //Check is user exists
    isUserExist(email : string )
    //generate random passwords
    generatePassword()
    //encrypt the password
    hashPassword(password:string)
    //validate password
    validatePassword(email:string, password:string)
    //find one record with filter and fields
    findOne(filter :Record<string,any> ,fields : Array<string>)
    //update user
    updateUser(filter: Record<string, any>, data: any):Promise<UpdateWriteOpResult>
    //create jwt tokens
    createJwtTokens(email:string,id:string)
    //increment login attempts
    incrementLoginAttempts(email:string)
    // find all users
    findAll();
    // find user by ID
    findById(id:string);
    //create user
    create(user:User);
    //Update User
    update(user:any):Promise<UpdateWriteOpResult>;
}