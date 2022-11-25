import { Request } from 'express';
import { ISong } from '../../models/playlist-model';

// userId is added to the request by auth.verify

export interface ICreatePlaylistRequest extends Request {
	userId: string;
	body: {
		name: string;
		songs: ISong[];
	}
};
export interface IDeletePlaylistRequest extends Request {
	userId: string;
};
export interface IGetPlaylistsRequest extends Request {
	userId: string;
}
