import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuditRepository } from 'src/domain/audit/interfaces/audit-repository.interface';
import { IS_PUBLIC_KEY } from 'src/domain/user-auth/decorators/public-route.decorator';
import { AuditMiddleware } from '../middleware/audit.middleware';

/**
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector,
        @Inject('AuditRepository') private auditRepository: AuditRepository) { }

    /**
     * @param {ExecutionContext} context
     * @return {*}  {Promise<boolean>}
     * @memberof AuthGuard
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request: any = context.switchToHttp().getRequest();
        const response: any = context.switchToHttp().getResponse();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.ACCESS_TOKEN_SECRET
                }
            );

            request['user'] = payload;
            new AuditMiddleware(this.auditRepository).use(request, response, () => true)
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    /**
     * @private
     * @param {Request} request
     * @return {*}  {(string | undefined)}
     * @memberof AuthGuard
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}
