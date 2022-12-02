export { };

import * as express from 'express';
import { Response } from 'express';
import { CallbackError } from 'mongoose';
import { IPlaylist, IPlaylistExport } from '../models/playlist-model';
import Playlist from '../models/playlist-model';
import { IUser, UserSchema, User } from '../models/user-model';
import { ICreatePlaylistRequest, IDeletePlaylistRequest, IGetPlaylistsRequest, IUpdatePlaylistRequest } from './requests/playlist-requests';
import auth from '../auth';

function exportPlaylist(playlist: IPlaylist): IPlaylistExport {
	return {
		_id: playlist._id,
		name: playlist.name,
		ownerUsername: playlist.ownerUsername,
		songs: playlist.songs,
		publishDate: playlist.publishDate,
		listens: playlist.listens,
		likeCount: playlist.likeCount,
		dislikeCount: playlist.dislikeCount
	}
}

const createPlaylist = async (req: ICreatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	User
		.findOne({ _id: req.userId })
		.then(async (user: IUser | null) =>  {
			if (user === null) {
				return res.status(400).send('User could not be found.');
			}
			let i = 0;
			let found = false;
			while (!found) {
				await Playlist
					.findOne({ name: `Untitled Playlist ${i}`})
					.then((playlist: IPlaylist | null) => {
						if (playlist === null) {
							found = true;
						}
						else {
							i++;
						}
					})
					.catch((err: CallbackError) => console.log(err));
			}
			const playlist = new Playlist({
				name: `Untitled Playlist ${i}`,
				ownerUsername: user.username,
				ownerId: user._id,
				songs: [],
				publishDate: null,
				listens: 0,
				likeCount: 0,
				likes: new Map(),
				dislikeCount: 0,
				dislikes: new Map()
			});
			user.playlists.push(playlist._id);
			user.save().then(() => {
				playlist
					.save()
					.then(() => {
						return res.status(201).json({
							playlist: exportPlaylist(playlist)
						});
					})
					.catch((err) => {
						console.log(err);
						return res.status(400).json({
							errorMessage: 'Playlist not created!'
						});
					});
			});
	});
}

const duplicatePlaylist = (req: ICreatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' });
	}
	User
		.findOne({ _id: req.userId })
		.then(async (user: IUser | null) => {
			if (user === null) {
				return res.status(400).send('User could not be found.');
			}
			Playlist
				.findById(req.params.id)
				.then(async (playlist: IPlaylist | null) => {
					if (playlist === null) {
						return res.status(404).json({ errorMessage: 'Playlist not found!' });
					}
					let i = 1;
					let found = false;
					while (!found) {
						await Playlist
							.findOne({ name: playlist.name + ` ${i}`})
							.then((playlist: IPlaylist | null) => {
								if (playlist === null) {
									found = true;
								}
								else {
									i++;
								}
							})
							.catch((err: CallbackError) => console.log(err));
					}
					const dupePlaylist = new Playlist({
						name: playlist.name + ` ${i}`,
						ownerUsername: user.username,
						ownerId: user._id,
						songs: playlist.songs,
						publishDate: null,
						listens: 0,
						likeCount: 0,
						likes: new Map(),
						dislikeCount: 0,
						dislikes: new Map()
					});
					user.playlists.push(dupePlaylist._id);
					user.save().then(() => {
						dupePlaylist
							.save()
							.then(() => {
								return res.status(201).json({
									playlist: exportPlaylist(dupePlaylist)
								});
							})
					});
				})
			})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				errorMessage: 'Playlist not created!'
			});
		});;
};

const deletePlaylist = async (req: IDeletePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to delete this playlist.'});
			}
			Playlist
				.findByIdAndDelete(req.params.id)
				.then(() => { return res.status(200).json({ body: 'Playlist successfully deleted.' }); })
				.catch((err: CallbackError) => console.log(err));
		})
		.catch((err: CallbackError) => console.log(err));
}

const getUserPlaylists = async (req: IGetPlaylistsRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized access.' });
	}
	Playlist
		.find({ id: req.userId })
		.select('name ownerName songs publishDate listens likeCount dislikeCount')
		.exec()
		.then((playlists: IPlaylist[]) => {
			if (!playlists.length) {
				return res
					.status(404)
					.json({ error: 'Playlists not found.' });
			}
			return res.status(200).json({ playlists: playlists });
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({ error: err });
		});
}

const publishPlaylist = async(req: IUpdatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to publish this playlist!' });
			}
			if (playlist.publishDate !== null) {
				return res.status(400).json({ errorMessage: 'Playlist is already published!' });
			}
			playlist.publishDate = new Date();
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully published!' });
				})
				.catch((error: CallbackError) => {
					console.log(error);
					return res.status(400).json({ body: 'Playlist not published!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not published!' });
		})
}

const updatePlaylist = async(req: IUpdatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	if (!req.body) {
		return res.status(400).json({
			error: 'You must provide a body to update!'
		});
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to edit this playlist!' });
			}
			if (playlist.publishDate !== null) {
				return res.status(400).json({ errorMessage: 'Playlist cannot be edited!' });
			}
			let updatedPlaylist = req.body.playlist;
			playlist.name = updatedPlaylist.name;
			playlist.songs = updatedPlaylist.songs;
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully edited!' });
				})
				.catch((error: CallbackError) => {
					console.log(error);
					return res.status(400).json({ body: 'Playlist not edited!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not edited!' });
		})
}

const PlaylistController = {
	createPlaylist,
	duplicatePlaylist,
	deletePlaylist,
	getUserPlaylists,
	publishPlaylist,
	updatePlaylist
}
export default PlaylistController; 
