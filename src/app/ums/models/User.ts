import { IUser } from '../interfaces/user';

export class User implements IUser {
    id: number = 0;
    name: string = '';
    lastname: string = '';
    email: string = '';
    fiscalcode: string = '';
    province: string = '';
    phone: string = '';
    age: number = 0;
}
