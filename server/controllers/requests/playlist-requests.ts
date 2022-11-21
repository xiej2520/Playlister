import { Request } from 'express';

export interface ICreatePlaylistRequest extends Request {
	userId: string;
};
export interface IDeletePlaylistRequest extends Request {
	userId: string;
};
