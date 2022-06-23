import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { getTestFakeUsersService } from './users.test.utils';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = getTestFakeUsersService();
    const module: TestingModule = await Test.createTestingModule({
      // list of things we want to register in out testing DI (dependency injection) container
      providers: [
        AuthService,
        {
          // if anyone asks for UsersService, give them fakeUsersService
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws an error if user signs up with already used email', async ()=> {
    const user1 = await service.signup('adfwoa@gmail.com', 'woiejwao')
    try {
      const user2 = await service.signup('adfwoa@gmail.com', 'woiejwao')
    } catch(err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('create a new user with a salted and hashed password', async () => {
    fakeUsersService.findOneByEmail = (email: string) => { return Promise.resolve(null)}
    const user = await service.signup('adfwoa@gmail.com', 'woiejwao')

    expect(user.password).not.toEqual('woiejwao');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws if signin is called with an unused email', async () => {
    fakeUsersService.findOneByEmail = (email: string) => { return Promise.resolve(null)}
    try {
      const user = await service.signin('adfwoa@gmail.com', 'woiejwao');
    } catch(err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  })

  it('throws if an invalid password is provided', async () => {
    const email = 'foo@gmail.com';
    const password = 'foopassword'
    await service.signup(email, password);
    try {
      const user = await service.signin(email, 'woiejwewwwwao');
    } catch(err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  })

  it('lets user sign in with the correct password', async () => {
    const email = 'test123@gmail.com';
    const password = 'test123password'
    await service.signup(email, password);
    const user = await service.signin(email, password);
    expect(user).toBeDefined();
  })
});
