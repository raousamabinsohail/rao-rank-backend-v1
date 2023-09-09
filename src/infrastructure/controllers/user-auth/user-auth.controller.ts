import { Body, Controller, Get, Param, Post, Inject, UsePipes, Req, Query, Request, Put } from '@nestjs/common';
import { Login, UpdateUserDto, User } from 'src/domain/user-auth/dto/user-type..dto';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { registerUser, userSignup, validateLoginSchema } from './user-validations';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthService } from 'src/usecase/services/user-auth/user-auth.service';
import { OpenRoute } from 'src/domain/user-auth/decorators/public-route.decorator';
import { GenericResponse } from 'src/domain/dto/generic';
import { Secured } from 'src/domain/user-auth/decorators/authorization.decorator';

/**
 * @export
 * @class UserAuthController
 */
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserAuthController {

    /**
     * Creates an instance of UserAuthController.
     * @param {UserAuthService} userService
     * @memberof UserAuthController
     */
    constructor(private userService: UserAuthService) { }


    /**
     *
     * Signup User
     * @param {User} user
     * @return {*}  {Promise<any>}
     * @memberof UserAuthController
     */
    @Post('/register')
    @OpenRoute()
    @UsePipes(new JoiValidationPipe(userSignup)) //validating the object
    SigunUp(@Body() user: User): Promise<GenericResponse<any>> {
        return this.userService.signUp(user)
    }

    @Put('/update-password')
    public async updatePassword(@Body() body: any, @Request() req: any) {
        return this.userService.updatePassword(body.password, req.user.uid);
    }


    /**
     *
     * create User From inside the portal
     * @param {User} user
     * @return {*}  {Promise<any>}
     * @memberof UserAuthController
     */
    @Post('/create')
    @Secured('USER_MANAGEMENT', 'c')
    @UsePipes(new JoiValidationPipe(registerUser)) //validating the object
    register(@Body() user: User): Promise<GenericResponse<any>> {
        return this.userService.create(user)
    }


    /**
     *
     * Login to the system
     * @param {Login} login
     * @param {Request} request
     * @return {*} 
     * @memberof UserAuthController
     */
    @Post('/login')
    @OpenRoute()
    @UsePipes(new JoiValidationPipe(validateLoginSchema)) //validating the object
    login(@Body() login: Login, @Req() request: Request): Promise<GenericResponse<any>> {
        return this.userService.login(login, request.headers['user-agent'])
    }

    @Post('forgot-password')
    @OpenRoute()
    public async forgotPassword(@Body('email') email:string):Promise<GenericResponse<null>> {
        return this.userService.forgotPassword(email);
    }

    @Put('')
    @Secured('USER_MANAGEMENT', 'u')
    public async update(@Body() user: UpdateUserDto): Promise<GenericResponse<null>> {
        return this.userService.update(user);
    }


    /**
     *
     * Get All users
     * @param {number} offset
     * @param {number} page
     * @return {*}  {Promise<GenericResponse<User[]>>}
     * @memberof UserAuthController
     */
    @Get('/')
    @Secured('USER_MANAGEMENT', 'r')
    getUsers(): Promise<GenericResponse<User[]>> {
        return this.userService.getUsers();
    }

    /**
     *
     * Get User by ID
     * @param {string} id
     * @return {*}  {Promise<User>}
     * @memberof UserAuthController
     */
    @Get('/:id')
    @Secured('USER_MANAGEMENT', 'r')
    getUserById(@Param('id') id: string): Promise<GenericResponse<User>> {
        return this.userService.getUserById(id);
    }

    @Put('/activate/:id')
    @Secured('USER_MANAGEMENT', 'u')
    public async activateUser(@Param('id') id: string): Promise<GenericResponse<null>> {
        return this.userService.activateUser(id);
    }

    @Put('/deactivate')
    @Secured('USER_MANAGEMENT', 'u')
    public async deactivateUser(@Body() { _id, reason }): Promise<GenericResponse<null>> {
        return this.userService.deactivateUser(_id, reason);
    }

    @Put('/undo/deactivate/:id')
    @Secured('USER_MANAGEMENT', 'u')
    public async undoDeactivate(@Param('id') id: string): Promise<GenericResponse<null>> {
        return this.userService.undoDeactivate(id);
    }
}

