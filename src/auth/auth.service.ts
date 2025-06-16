import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(
        loginDto: LoginDto
    ): Promise<{ access_token: string; user: Partial<User> }> {
        const user = await this.userService.findByEmail(loginDto.email);

        if (
            !user ||
            !(await this.userService.validatePassword(
                loginDto.password,
                user.password
            ))
        ) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        const { password, ...userWithoutPassword } = user;

        return {
            access_token: this.jwtService.sign(payload),
            user: userWithoutPassword,
        };
    }

    async validateUser(payload: any): Promise<User> {
        return await this.userService.findById(payload.sub);
    }
}
