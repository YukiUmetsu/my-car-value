import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from './users.service';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            throw new BadRequestException('Email is already in use');
        }

        const hashedPassword = await this.generatePassword(password);
        const newUser = await this.usersService.create(email, hashedPassword);
        return newUser;
    }

    async generatePassword(passwordString: string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(passwordString, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        return result
    }

    async signin(email: string, password: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedhash] = user.password.split('.');
        const passwordMatched = await this.comparePassword(password, salt, storedhash);
        if (!passwordMatched) {
            throw new BadRequestException('bad password');
        }
        return user;
    }

    async comparePassword(givenPassword: string, salt: string, storedHash: string): Promise<boolean> {
        const hash = (await scrypt(givenPassword, salt, 32)) as Buffer;
        return hash.toString('hex') === storedHash;
    }
}
