import { AuthService } from "./auth.service";
import { User } from "./user.entity"
import { UsersService } from "./users.service"

// export const getTestFakeUsersService = (): Partial<UsersService> => {
//     return {
//         findOne: (id: number) => Promise.resolve(getFakeUser()),
//         create: (email: string, password: string) => Promise.resolve(getFakeUser(email, password)),
//         findOneByEmail: (email) => Promise.resolve(getFakeUser(email)),
//     }
// }

// this function actually stores users data in memory
export const getTestFakeUsersService = (): Partial<UsersService> => {
    const users: User[] = [];
 
    return {
        findOne: (id: number) => {
            const filteredUsers = users.filter(user => user.id === id)
            return Promise.resolve(filteredUsers[0])
        },
        create: (email: string, password: string) => {
            const user = {id: 1, email, password} as User
            users.push(user);
            return Promise.resolve(user);
        },
        findOneByEmail: (email) => {
            const filteredUsers = users.filter(user => user.email === email)
            return Promise.resolve(filteredUsers[0])
        },
    }
}
export const getFakeUser = (email="test@example.com", password="testpassword"): User => { return {id: 1, email, password} as User};

export const getTestFakeAuthService = (): Partial<AuthService> => {
    return  {
        signup: (email, password) => Promise.resolve({id: 1, email, password} as User),
        signin:  (email, password) => Promise.resolve({id: 1, email, password} as User),
      }
}