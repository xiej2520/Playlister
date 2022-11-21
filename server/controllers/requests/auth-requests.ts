import { Request } from 'express';
import { Types } from 'mongoose';

export interface IRegisterUserBody {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	passwordVerify: string;
}
