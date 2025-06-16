import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (
            user &&
            (await this.userService.validatePassword(password, user.password))
        ) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Credenciais inválidas');
    }
}
