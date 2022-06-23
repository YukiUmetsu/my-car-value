import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getTestFakeAuthService, getTestFakeUsersService } from './users.test.utils';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = getTestFakeUsersService();
    fakeAuthService = getTestFakeAuthService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAllUsers returns a list of users with given email', async () => {
    const email = 'adfwoa@gmail.com';
    const password = 'adfwoa32wrfw3';
    await fakeUsersService.create(email, password);
    const user = await controller.findUsersByEmail(email);
    expect(user).toBeDefined();
    expect(user.email).toEqual(email);
  })

  it('findUser returns a single user with the given id', async () => {
    const email = 'adfwoa@gmail.com';
    const password = 'adfwoa32wrfw3';
    await fakeUsersService.create(email, password);
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.email).toEqual(email);
  })

  it('findUser throws an error if user with given id is not found', async () => {
    try {
      await controller.findUser('1');
    } catch(err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: 10};
    const user = await controller.signin(
      {email: 'adfwoa@gmail.com', password: 'jwoejfrwe8osa'},
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
