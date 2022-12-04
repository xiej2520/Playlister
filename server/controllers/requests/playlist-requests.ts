import { Request } from 'express';
import { IPlaylist, ISong } from '../../models/playlist-model';

// userId is added to the request by auth.verify

export interface ICreatePlaylistRequest extends Request {
	userId: string;
};
export interface IDeletePlaylistRequest extends Request {
	userId: string;
};
export interface IGetPlaylistsRequest extends Request {
	userId: string;
}

export interface IUpdatePlaylistRequest extends Request {
	userId: string;
	body: {
		playlist: IPlaylist;
	};
}

export interface ILikePlaylistRequest extends Request {
	userId: string;
	body: {
		like: boolean;
	}
}

export interface IDislikePlaylistRequest extends Request {
	userId: string;
	body: {
		dislike: boolean;
	}
}

export interface ICommentPlaylistRequest extends Request {
	userId: string;
	body: {
		comment: string;
	}
}
